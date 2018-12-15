/* --------- 透明的单例模式 --------- */

// function Singleton(name) {
//     if (!Singleton.instance) {
//         this.name = name;
//         Singleton.instance = this;
//     } else {
//         return Singleton.instance
//     }
// }

// 使用 CreateDiv 单例类，在页面创建唯一的 div 节点
const CreateDiv = (function() {
    let instance;

    return function(html) {
        if (instance) {
            return instance;
        }

        this.html = html;
        const div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);

        return instance = this;
    }
})()

a = new CreateDiv('aki')
b = new CreateDiv('cute')

a === b // true