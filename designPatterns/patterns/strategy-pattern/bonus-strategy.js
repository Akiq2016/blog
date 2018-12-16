// strategy
class PerformanceS {
    caculate (salary) {
        return salary * 4;
    }
}
class PerformanceA {
    caculate (salary) {
        return salary * 3;
    }
}
class PerformanceB {
    caculate (salary) {
        return salary * 2;
    }
}

// bonus
class Bonus {
    constructor (salary, strategy) {
        this.salary = salary;
        this.strategy = strategy;
    }

    // bonus 对象本身没有能力进行计算，而是把请求委托给了策略对象
    getBonus () {
        return this.strategy.caculate(this.salary);
    }
}

aki = new Bonus(100, new PerformanceB)
aki.getBonus() // 200

// 以上我们让 strategy 对象从各个策略类中创建，这是模拟一些传统面向对象语言的实现。
// 实际在 JavaScript 中，函数也是对象，所以更简单和直接的做法是把 strategy 直接定义为函数。
const Performances = {
    S (salary) {
        return salary * 4;
    },
    A (salary) {
        return salary * 3;
    },
    B (salary) {
        return salary * 2;
    }
}

function getBonus (level, salary) {
    return Performances[level](salary);
}

getBonus('B', 100) // 200