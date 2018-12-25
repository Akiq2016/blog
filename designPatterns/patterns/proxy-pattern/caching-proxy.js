// 缓存代理可以为一些开销大的运算结果提供暂时的存储，
// 在下次运算时，如果传递进来的参数跟之前一样，则可以直接返回前面存储的运算结果。

// 缓存代理用于 ajax 异步请求数据

// demo： 乘积缓存
const mult = function () {
    let res = 1;
    for (let i = 0, l = arguments.length; i < l; i++) {
        res = res * arguments[i];
    }

    return res;
}

const proxyMult = (function () {
    const cached = {};

    return function () {
        const args = Array.prototype.join.call(arguments, ',');
        if (args in cached) {
            return cached[args];
        }

        return cached[args] = mult.apply(this, arguments);
    }
})()