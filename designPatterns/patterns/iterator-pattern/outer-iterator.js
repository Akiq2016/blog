// 外部迭代器必须显式请求迭代下一个元素
// 相对复杂，灵活性强，我们可以手工控制迭代的过程或者顺序
function iterator (obj) {
    let current = 0;

    return {
        next: _ => { current += 1; },
        isDone: _ => current >= obj.length,
        getCurrentItem: _ => obj[current]
    }
}

const compare = function (iterator1, iterator2) {
    while(true) {
        if (iterator1.isDone() && iterator2.isDone()) {
            break;
        } else if (iterator1.isDone() || iterator2.isDone()) {
            throw new Error('iterator1 和 iterator2 不相等');
        } else if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
            throw new Error('iterator1 和 iterator2 不相等');
        } else {
            iterator1.next();
            iterator2.next();
        }
    }

    console.log('iterator1 和 iterator2 相等');
}

let iterator1 = iterator([1,2,3]);
let iterator2 = iterator([1,2,3]);

compare(iterator1, iterator2);