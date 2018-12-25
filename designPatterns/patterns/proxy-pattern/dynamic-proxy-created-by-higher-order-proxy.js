// 通过传入高阶函数这种灵活的方式，为各种计算方法创建缓存代理
// 现在这些计算方法被当作参数传入一个专门用于创建缓存代理的工厂。

const mult = function () {
    let res = 1;
    for (let i = 0, l = arguments.length; i < l; i++) {
        res = res * arguments[i];
    }

    return res;
}

const plus = function () {
    let res = 0;
    for (let i = 0, l = arguments.length; i < l; i++) {
        res = res + arguments[i];
    }

    return res;
}

const createProxyFactory = function (fn) {
    const cached = {};

    return function () {
        const args = Array.prototype.join.call(arguments, ',');
        if (args in cached) {
            return cached[args];
        }

        return cached[args] = fn.apply(this, arguments);
    }
}

const proxyMult = createProxyFactory(mult);
const proxyPlus = createProxyFactory(plus);

proxyMult(1,2,3,4); // 24