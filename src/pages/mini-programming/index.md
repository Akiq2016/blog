---
title: mini-programming
date: "2017-07-13T12:00:00.121Z"
---

一、环境搭建踩进的坑

1. 小程序的基础开发结构
```
miniProgram/
├─ app.wxss     // 小程序公共样式表
├─ app.json     // 小程序公共设置
├─ app.js       // 小程序逻辑
├─ pages
│   ├── index
│   │     ├── index.js    // 页面逻辑
│   │     ├── index.wxml  // 主页面
│   │     ├── index.wxss  // 页面样式表
│   │     └── index.json  // 页面配置

```

2. 小程序提供的API

```js
// 小程序的API都是长这个模样的，初次见到觉得这些API可以忍受
wx.request({
  url: 'test.php',
  data: 123,
  header: { 'content-type': 'application/json' },
  success: function(res) {}
})

// 直到我正式开发 陷入嵌套地狱。
// 小程序中各种请求操作都需要带上session3rd，获取这个的办法是
// 启动小程序时：wx登录 && wx获取用户信息 => 请求登录 => 储存session3rd
let login = () => {
  wx.login({
    success (res_login) {
      wx.getUserInfo({
        success (res_user) {
          wx.request({
            url: '/doLogin',
            method:'POST',
            data: {
              code: res_login.code,                 // 登录凭证
              iv: res_user.iv,                      // 加密算法的初始向量
              encryptedData: res_user.encryptedData // 加密数据
            },
            success (res_request) {
              wx.setStorage({ key: "session3rd", data: res_request.data.data })
            },
            fail () {
              console.warn('[end]请求session3rd失败')
            }
          })
        },
        fail () {
          console.warn('[end]获取用户信息失败') 
        }
      })
    },
    fail () {
      console.warn('[end]登录失败')
    } 
  }) 
}
```

3. 引入第三方库经历的神坑

# 我无法容忍自己继续乖乖地按照他的API进行开发 所以决定来一发promise，封装一下。
 
【官方】
# [官方文档 - ES6 API 支持情况]：支持 Promise
# [更新日志 0.11.112200]：同客户端保持一致，移除 Promise，开发者需要自行引入兼容库

【本人】
# Google一会：小程序支持Promise => 需要自行引入
# 更新日志中只搜到一次Promise被移除的信息，没有重新加上的更新日志 => 文档里ES6支持情况中还写支持Promise我不知道什么情况，大概没更新
# 总之安全起见，引入第三方Promise

npm install bluebird
const Promise = require("bluebird")
# [result] 2个严重问题
# 1 Network中看到，node_modules下的所有js文件都被加载了。早就超过了小程序的1M大小限制。而我本意只是想引入一个bluebird而已呀
# 2 而且bluebird也没有引入成功 => 只能傻瓜式写全文件的相对路径 require("node_modules/bluebird/dist/promise.js")
文档中[模块化]有说明: 小程序目前不支持直接引入 node_modules , 开发者需要使用到 node_modules 时候建议拷贝出相关的代码到小程序的目录中。

mkdir lib
cp -rf node_modules/bluebird/dist/promise.js lib
rm -rf node_modules
# [result] 1个严重问题
# 1 在安卓真机下会报错 => bluebird中有对dom进行操作
文档中[逻辑层]有说明: 由于框架并非运行在浏览器中，所以 JavaScript 在 web 中一些能力都无法使用，如 document，window 等


4. 吾辈终于使用上了Promise

let Promise = require('../lib/promise')
class Tools {
  constructor() {}
  /**
   * let wx.function use promise
   * @param  {Function} fn [description]
   * @return {Function}    [description]
   */
  wxPromise (fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) { resolve(res) }
        obj.fail = function (res) { reject(res) }
        fn(obj)
      })
    }
  }
  -- ... 其他工具
}
export default Tools

-- 用起来大概是这个样子
const T = new Tools
T.wxPromise(wx.getStorage)({ key: "userInfo" })
  .then(res => console.log(res))
  .catch(err => console.log(err))


5. 生命在于折腾。吗

出发点：
-- 我想要用async/await简化我的代码

编译工具及方案：
-- 微信开发工具的ES6转ES5的编译选项不满足需求 => 
-- 自己编译 =>
-- 只需要编译js 其他的鬼文件(比如wxss wxml这些后缀的)交回给微信开发工具来操作 =>
-- gulp应该是最简选择

主要报错信息：Uncaught ReferenceError: regeneratorRuntime is not defined
-- 考虑引入babel-polyfill =>
-- 【Usage in Node / Browserify / Webpack】=>
-- To include the polyfill you need to require it at the top of the entry point to your application.
-- 【Usage in Browser】=>
-- Available from the dist/polyfill.js file within a babel-polyfill npm release. This needs to be included before all your compiled Babel code.
-- You can either prepend it to your compiled code or include it in a <script> before it.
这里其实踩了很久坑，一直在查babelrc配置是否有问题/需要加其他依赖，最后发现是和引入promise时同样的问题：
引入的polyfill.js中存在document/window等小程序环境中不存在的对象。
最后是引入非死不可的regenerator库解决问题的。（踩在巨人的肩膀上）
 
.babelrc配置：
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }]
  ]
}

gulpfile配置：
-- ...
gulp.task('build:js', done =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
)
gulp.task('build:others', done =>
  gulp.src(['src/**/*.*', '!src/**/*.js'])
    .pipe(gulp.dest('dist'))
)
-- ...


6. 给你们看看美丽的登录代码

-- 截取自app.js
  async Login () {
    let login, infor, dolog;
    try {
      login = await this.Tools.wxPromise(wx.login)()
      infor = await handleUserInfor()
      if (!infor) return
      dolog = await this.Http.post("/doLogin", {
        code: login.code, iv: infor.iv, encryptedData: infor.encryptedData
      })
      wx.setStorage({ key: "session3rd", data: dolog.data.session3rd })
    } catch (e) {
      console.log(e)
    }
  }


7. 上帝不会放过你

-- 第一版小程序发布啦 解脱啦 我会用小程序啦
-- 兼职推广的学生 他iPhone5没反应啊
-- 怎么想都是他手机太烂了
-- 可是司机的手机也不会好到哪去
-- emmmmmmm ... 嘻嘻

困难：
-- 小程序的调试难点在于不同手机中表现形式也很狂放 线上环境没办法调试 开发环境真机调试代码不方便
排查：
-- iPhone5在开发模式下 正常触发启动逻辑(app.js)和主页面(index.js)的生命周期方法
-- 但登录逻辑未正常执行 未报错 导致数据缺失 无法通过进入系统的逻辑判断
-- 尝试添加console在真机追踪代码执行 发现有执行await 后面的代码 但是await没有返回值
猜测：
-- 有些老手机不支持await编译后的代码！？ 编译后你都不支持 那我能怎么办！？！？
手段：
-- 绝望的灵机一动 使用TJ大佬的Co模块代替await/async语法糖，初次尝试发现yield 后执行完有返回 看起来解决了发现的await没有返回的问题

困难：
-- 替换过程中 发现有些地方还是不能正常执行 表现形式跟iPhone5的bug一样
排查：
-- co使用不够了解。阮兔哥es6教程中截取以下两句：
-- 【1】co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是Promise 对象和原始类型的值
-- 【2】async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作
-- 查阅co repo，这些都可以找到答案：
-- 【1】The yieldable objects currently supported are: promises; thunks; array; objects; generators; generator functions.
-- 【2】Returns a promise that resolves a generator, generator function, or any function that returns a generator.
-- 所以还是不要过度依赖教程 有官方repo去查阅官方文档
猜测：
-- co一层是没有问题的（这也是最初改用co的原因）=> 嵌套两层co可能就会有问题。验证co一层 co两层 发现后者确实没有响应。
-- 这时候感觉到和await的bug是一样的 返回类型都为promise co两层的时候 就出现问题（使用await的时候 没有排查出是两层会有问题）
-- 且编译后代码 即便是使用yield关键字 也依赖了regenerator第三方库来支持 所以他们也是在相同的依赖环境
-- 在开发工具中打印返回值Promise为native code，并没有使用到第三方引用的Promise
-- 考虑我们封装的wxPromise等方法使用了第三方promise，但async函数返回的promise不是我们第三方引用的Promise对象 这个如何控制？
手段：
-- 在黄志大佬的永不放弃的精神中，最后发现了regenerator第三方库编译后代码中存在new Promise的关键词
-- 于是我们在使用regenerator前 也引入一次第三方Promise 得以保证在不同手机环境下 都能正常使用Promise


8. 实际项目目录：

# 在开发者工具中 开发目录不能选择miniProgram，一定要选择miniProgram/dist目录 否则会报错
# 至于为什么 请回到第一步看小程序的开发目录的结构要求
 
miniProgram/
├─ app.wxss
├─ app.json
├─ app.js

├─ .babelrc
├─ .gitignore
├─ gulpfile.js
├─ package.json
 
├─ dist
│   └── ...

├─ src
│   ├── actions
│   │     ├── handleRequestError.js
│   │     ├── handleRequireError.js
│   │     └── ...
│   ├── lib
│   │     ├── promise.js
│   │     ├── regenerator.js
│   │     └── ...
│   ├── page
│   │     ├── driver
│   │     │     └── ...
│   │     ├── shipper
│   │     │     └── ...
│   │     ├── team
│   │     │     └── ...
│   │     └── ...
│   ├── utils
│   │     ├── config.js
│   │     ├── http.js
│   │     ├── tools.js
│   │     └── ...
│   ├── fonts
│   │     └── ...


9. 写一篇1000字总结痛斥小狗屎程序

其实这第一部分的尿点主要是自找的，如果你对代码的可读性没有太大要求，不需要使用promise，async等语法，使用callback完全可以满足业务需求并快速开发，那么完全不需要自己去编译 分成开发&生产目录，也不需要苦等每次保存的时候 慢吞吞的编译 开发工具卡卡的反应。

如果只是简单的一点需求，我想小程序开发起来确实很快，又简单，但是当需求多起来了，开发效率会明显变慢，并且后期难以维护。所以在开发第一版功能的同时，花了大量时间研究如何让小程序环境支持一些新的语法。

回顾一下这一部分，其实发现所有问题都出自于如何正确引用第三方库。小程序环境不支持调用npm包，且不存在document / window，这一点已经消灭了大量第三方库在小程序中正常使用的可能性，这也是引入promise&polyfill时遇到过的问题。以及没有在所有生成了promise的地方 引入第三方promise来兼容。

这些问题，基本是通过检查编译后代码，以及第三方库源码，来找到解决方案的。现在看似很简单，问题都很统一，但是我却是一再的踩进坑里无法自拔。前期考虑过是否使用wepy框架：wepy解决了编译方面的痛点，以及支持组件化开发，而且类vue的写法，可以说是比较符合开发者需求了。但是我认为，我不需要为了小程序框架引入小程序框架的框架，我只需要解决一些语法上的支持问题，如果需要封装API之类的，直接自己写就好了，wepy非常的奶妈了。我对小程序的API不熟悉，还要花一些精力去学习wepy，就没什么必要。但事实证明，我正常使用上所谓语法上的时间，可能比上手wepy需要的时间，还要久，而且我还不知道，还有没有其他兼容问题，哈哈哈哈哈fuck myself。不过应该是没有了 我猜的。之后如果确实有需要的话，也可以用wepy重写，但是我想我不会这么无聊的。



10. 查阅

在小程序使用promise/async的方法

babel的配置

Co文档查阅

类vue开发的wepy

二、逻辑层踩进的坑
前言：不要想当然的以自己拥有的常识去认为小程序的这个那个的API按常理应该是怎么用的，你的常识算个猫。



1、wx.chooseImage(OBJECT)  从本地相册选择图片或使用相机拍照。

OBJECT中sizeType参数接受original 原图，compressed 压缩图，默认二者都有。

在PC端开发者工具中sizeType无效：永恒的原图；真机有效。



2、wx.request(OBJECT)  进行网络请求。

OBJECT中fail参数接受function，接口调用失败的回调函数。

注意，语文不及格的不配做开发，请回家耕田吧。此处的fail被调用的情况是接口调用失败，而不是请求失败。

请根据请求返回的状态码自行封装请求失败的处理方法。



3、wx.navigateTo(OBJECT)  保留当前页面，跳转到应用内的某个页面。

小程序规定页面路径只能是五层，应该避免多层级的交互方式。也就是说，你的历史记录里的页面加上当前页面最大 = 5。

如果当前页面已经是第5个页面了，再调用navigateTo，他也不报错，也没反应，仿佛这个这个方法不曾存在。



4、tabBar  导航条

如果使用了tabBar，app.json中的pages数组，第一个元素一定要是tabBar中的定义的导航页面。

否则页面跟你的大脑一样一片空白，也不报错。当然，你的导航页面也不能带有参数，你有这个需求也老实分成几个页面吧。

从一个非tabBar的页面，跳转到tabBar的页面中，navigateTo, redirectTo无效，也不报错。

打开tabBar的页面要用switchTab方法，这个方法只能打开 tabBar 页面。

以及navigateTo redirectTo的url写的是当前页面的相对路径，switchTab的不是，如果踩坑了拿放大镜认真看看文档。