/* --------- 用代理实现的单例模式 --------- */

// 场景：假如某天我们需要用 CreateDiv 这个类，创建许多 div，
// 即把这个单例类变成普通的可产生多个实例的类，
// 那我们需要改写 CreateDiv 构造函数，这种修改会给我们带来不必要的烦恼

// 使用 CreateDiv 单例类，在页面创建唯一的 div 节点
const CreateDiv = function (html) {
    this.html = html;
    const div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
}

const ProxySingletonCreateDiv = (function () {
    let instance;

    return function (html) {
        if (instance) {
            return instance;
        }

        return instance = new CreateDiv(html);
    }
})()

a = new ProxySingletonCreateDiv('aki')
b = new ProxySingletonCreateDiv('cute')

a === b // true