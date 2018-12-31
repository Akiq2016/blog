// 指定好发布者
// 给发布者添加缓存列表 用于存放回调函数以便通知订阅者
// 发布消息时 发布者会遍历缓存列表 依次触发回调函数

// 定义发布者 售楼处
const salesOffices = {};
// 缓存列表
salesOffices.clientList = [];
// 订阅者
salesOffices.listen = function (fn) {
  this.clientList.push(fn);
}
// 发布消息
salesOffices.trigger = function () {
  for (let i = 0, fn = this.clientList[i++]; ;) {
    fn.apply(this, arguments);
  }
}

// 我们应当增加标示key，让订阅者只订阅自己感兴趣的消息

// 定义发布者 售楼处
const salesOffices = {};
// 缓存列表
salesOffices.clientList = {};
// 订阅者
salesOffices.listen = function (fn) {
  if (!this.clientList[key]) {
    this.clientList[key] = [];
  }

  this.clientList[key].push(fn);
}
// 发布消息
salesOffices.trigger = function () {
  const key = Array.prototype.shift.call(arguments);
  const cbList = this.clientList[key];

  if (!cbList || cbList.length === 0) {
    return false;
  }

  for (let i = 0, fn = cbList[i++]; ;) {
    fn.apply(this, arguments);
  }
}

// ====================== 通用实现 ====================== //

// 如果又有另外一家售楼处需要售楼 这段代码是否需要在另外一个售楼处对象上重写一遍呢
// 有没有办法让所有对象都拥有发布-订阅功能？

const event = {
  clientList: [],
  listen(key, cb) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }

    this.clientList[key].push(fn);
  },
  trigger() {
    const key = Array.prototype.shift.call(arguments);
    const cbList = this.clientList[key];

    if (!cbList || cbList.length === 0) {
      return false;
    }

    for (let i = 0, fn = cbList[i++]; ;) {
      fn.apply(this, arguments);
    }
  },
  remove(key, cb) {
    const cbList = this.clientList[key];

    if (!cbList) {
      return false;
    }

    if (!cb) {
      cbList.length = 0;
    } else {
      const index = cbList.findIndex(fn => fn === cb);
      if (~index) {
        cbList.splice(index, 1);
      }
    }
  }
}

const installEvent = function (obj) {
  for (let i in event) {
    obj[i] = event[i];
  }
}


// 存在问题
// 每个发布者对象都被添加了若干方法和属性 这是资源浪费
// 订阅者和发布者存在一定的耦合性 以上例子中 买家至少知道售楼处的名字是salesOffices 才能顺利订阅

// 发布订阅模式可以用一个全局的Event对象实现
// 订阅者不需要了解消息来自哪个发布者
// 发布者也不需要了解会推送给哪些订阅者

const Event = (function () {
  const clientList = [];

  const listen = function (key, cb) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }

    this.clientList[key].push(fn);
  };

  const trigger = function () {
    const key = Array.prototype.shift.call(arguments);
    const cbList = this.clientList[key];

    if (!cbList || cbList.length === 0) {
      return false;
    }

    for (let i = 0, fn = cbList[i++]; ;) {
      fn.apply(this, arguments);
    }
  };

  const remove = function (key, cb) {
    const cbList = this.clientList[key];

    if (!cbList) {
      return false;
    }

    if (!cb) {
      cbList.length = 0;
    } else {
      const index = cbList.findIndex(fn => fn === cb);
      if (~index) {
        cbList.splice(index, 1);
      }
    }
  };

  return {
    listen,
    trigger,
    remove
  }
})()

// 以上 都是必须订阅者先订阅一个消息，随后才能接收到发布者发布的消息
// 如果把顺序反过来 就不能接收到消息
// 但是这种需求是存在的。在某些情况需要把消息保存下来，等到有对象订阅它时，再重新把消息发布给订阅者
// 比如 用户导航栏订阅用户登录成功事件 以便在登录后 显示用户导航模块
// 但是可能存在订阅动作未执行完 登录的异步操作已成功

// 全局事件的命名冲突
// 全局的发布订阅对象中只有一个clientList来存放消息名和回调函数
// 久而久之难免出现命名冲突 所以我们可以支持创建命名空间