const myImage = (function () {
    const imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc(src) {
            imgNode.src = src;
        }
    }
})()

// 图片被加载好前 页面有一段明显的空白期
myImage.setSrc('http://xx.jpg');



// 图片预加载：先用loading图片占位，然后用异步的方式加载图片，加载好后再填充到img节点。
const myImage = (function () {
    const imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc(src) {
            imgNode.src = src;
        }
    }
})()

const proxyImage = (function () {
    const img = new Image();
    img.onLoad = function() {
        myImage.setSrc(this.src);
    }

    return {
        setSrc(src) {
            myImage.setSrc('./local/assets/directory/loading.gif');
            img.src = src;
        }
    }
})()

proxyImage.setSrc('http://xx.jpg');



// 不用代理的预加载图片函数：
const myImage = (function (){
    const imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    const img = new Image();

    img.onload = function () {
        imgNode.src = img.src;
    }

    return {
        setSrc(src) {
            imgNode.src = './local/assets/directory/loading.gif';
            img.src = src;
        }
    }
})()

myImage.setSrc('http://xx.jpg');

// 不这么用的原因：面向对象设计的原则 ———— 单一职责原则
// 单一职责原则指的是，就一个类（通常也包括对象和函数）而言，应该仅有一个引起它变化的原因。
// 指责被定义为“引起变化的原因”