// 编写一个动画类和一些缓动算法，让小球以各种各样的缓动效果在页面中运动。

/**
 * four things to learn:
 * t: current time
 * b: start value
 * c: change in value
 * d: duration
 */
const tween = {
    linear(t, b, c, d) {
        return c * t / d + b;
    },
    easeIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    strongEaseIn(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    strongEaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    sineaseIn(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    sineaseOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }
}

class BallAnimation {
    constructor(dom) {
        this.dom = dom;
        this.duration = null;
        this.startTime = 0;
        this.startPos = 0;
        this.endPos = 0;
    
        this.animationStrategy = null;
        this.propertyName = null;
    }

    start (propertyName, endPos, duration, animationStrategy) {
        this.duration = duration;
        this.startTime = +new Date;
        this.startPos = this.dom.getBoundingClientRect()[propertyName];
        this.endPos = endPos;
        this.propertyName = propertyName;
        this.animationStrategy = tween[animationStrategy];

        const timer = setInterval(() => {
            if (this.step() === false) {
                clearInterval(timer);
            }
        }, 19)
    }

    step () {
        const t = +new Date;
        if (t >= this.startTime + this.duration) { // 修正动画
            this.update(this.endPos);
            return false;
        } else {
            const _endPos = this.animationStrategy(
                t - this.startTime,
                this.startPos,
                this.endPos - this.startPos,
                this.duration
            )
            this.update(_endPos);
            return true;
        }
    }

    update (pos) {
        this.dom.style[this.propertyName] = `${pos}px`
    }
}
