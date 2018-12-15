/* --------- 惰性单例 --------- */

// 惰性单例指的是 在需要的时候才创建对象实例。
// 以下例子：与全局变量结合实现惰性单例
// 场景：WebQQ页面的登录浮窗。可以在页面初次加载时便创建好（隐藏状态），或在点击登录时，才创建。
const createLoginLayer = (function () {
    let div;

    return function () {
        if (!div) {
            const div = document.createElement('div');
            div.innerHTML = 'a log in popups';
            div.style.display = 'none';
            document.body.appendChild(div);
        }

        return div;
    }

})()

document.getElementById('loginBtn').onclick = function () {
    const loginDiv = createLoginLayer();
    loginDiv.style.display = 'block';
}

// 上一个例子存在的问题：违反单一职责原则（创建对象 & 管理单例的逻辑）；不具有通用性
// 通用的惰性单例：我们需要把不变的部分隔离出来（管理单例的逻辑可以完全抽象出来：用一个变量来标志是否创建过对象）
const getSingle = function (fn) {
    let result;

    return function () {
        return result || (result = fn.apply(this, arguments))
    }
}

// get login popups
const createSingleLoginLayer = getSingle(function () {
    const div = document.createElement('div');
    div.innerHTML = 'a log in popups';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
})
document.getElementById('loginBtn').onclick = function () {
    const loginDiv = createSingleLoginLayer();
    loginDiv.style.display = 'block';
}

// get specific iframe
const createSingleIframe = getSingle(function () {
    const iframe = document.createElement('iframe');
    document.appendChild(iframe);
})
document.getElementById('someBtn').onclick = function () {
    const someLayer = createSingleIframe();
    someLayer.src = 'http://xxxx.com';
}
