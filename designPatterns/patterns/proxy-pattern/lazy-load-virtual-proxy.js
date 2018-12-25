const cached = [];

const miniConsole = {
    log () {
        const args = arguments;
        cached.push(function () {
            return miniConsole.log.apply(miniConsole, args);
        })
    }
}

miniConsole.log(1);

document.body.addEventListener('keydown', function handler (evt) {
    if (evt.keyCode === 113) {
        const script = document.createElement('script');
        script.onload = function () {
            for (let i = 0, fn; fn = cached[i++];) {
                fn();
            }
        }

        script.src = 'miniConsole.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}, false);

// miniConsole.js 代码
miniConsole = {
    log () {
        // real code
    }
}

// ------------------------ 标准虚拟代理对象 ------------------------ //
const miniConsole = (function () {
    const cached = [];
    const handler = function (evt) {
        if (evt.keyCode === 113) {
            const script = document.createElement('script');
            script.onload = function () {
                for (let i = 0, fn; fn = cached[i++];) {
                    fn();
                }
            }
            script.scr = 'miniConsole.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            document.body.removeEventListener('keydown', handler, false);
        }
    }

    document.body.addEventListener('keydown', handler, false);

    return {
        log () {
            const args = arguments;
            cached.push(function () {
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})()