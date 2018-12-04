Function.prototype.before = function (beforefn) {
    const that = this;

    return function () {
        beforefn.apply(this, arguments);
        return that.apply(this, arguments);
    }
}

Function.prototype.after = function (afterfn) {
    const that = this;

    return function () {
        var ret = that.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};

var func = function () {
    console.log(2);
};

func = func
    .before(function () {console.log(1)})
    .after(function () {console.log(3)});

func();