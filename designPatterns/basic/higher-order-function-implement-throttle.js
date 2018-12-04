const throttle = function (fn, delay) {
    let timer;

    return function () {
        const args = arguments;
        const that = this;

        if (timer) {
            return false;
        }

        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            fn.apply(that, args);
        }, delay);
    };
};

window.onresize = throttle(function () {
    console.log(233);
}, 500);