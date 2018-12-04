Function.prototype.uncurrying = function () {
    const that = this;

    return function () {
        const obj = Array.prototype.shift.call(arguments);
        return that.apply(obj, arguments);
    }
}