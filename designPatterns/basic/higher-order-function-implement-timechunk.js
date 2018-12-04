// const arr = [];
// for (var i = 1; i <= 10000000; i++) {
//     arr.push(i);
// };

// var renderFriendList = function (data) {
//     for (var i = 0, l = data.length; i < l; i++) {
//         var div = document.createElement('div');
//         div.innerHTML = i;
//         document.body.appendChild(div);
//     }
// };

var timeChunk = function (arr, fn, execCount) {
    let timer;

    const start = function () {
        for (let i = 0, len = arr.length; i < Math.min(execCount || 1, len); i++) {
            fn(arr.shift());
        }
    };

    return function () {
        timer = setInterval(function () {
            if (arr.length === 0) {
                return clearInterval(timer);
            }

            start();
        }, 200);
    };
};

const arr = [];
for (let i = 1; i <= 10000000; i++) {
    arr.push(i);
};

const renderFriendList = timeChunk(arr, function (data) {
    let div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);
}, 8)