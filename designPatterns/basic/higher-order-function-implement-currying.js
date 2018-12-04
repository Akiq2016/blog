const currying = function (fn) {
    const args = [];

    return function () {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    }
};

const cost = (function () {
    let money = 0;

    return function () {
        for (var i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }

        return money;
    }
})();

const cost = currying(cost);

cost(100);
cost(200);
cost(300);

console.log(cost());