const synchronousFile = function (id) {
    console.log('sending http request here');
}

const proxySynchronousFile = (function () {
    const cached = []; // save ids during a time chunk
    let timer;

    return function(id) {
        cached.push(id);

        if (timer) {
            return;
        }

        timer = setTimeout(function () {
            synchronousFile(cached.join(','));
            clearTimeout(timer);
            timer = null;
            cached.length = 0;
        }, 2000);
    }
})()

const checkbox = document.getElementsByTagName('input');

for (let i = 0, c; c = checkbox[i++]; ) {
    c.onclick = function () {
        if (this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
}