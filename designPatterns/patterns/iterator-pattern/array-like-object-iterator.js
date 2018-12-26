// 无论是内部迭代器还是外部迭代器，只要被迭代的聚合对象拥有length属性，而且可以用下标访问，它就可以被迭代。
function each (obj, cb) {
    let value;
    let i = 0;
    let length = obj.length;
    isArray = isArraylike(obj);

    if (isArray) { // 迭代类数组
        for (; i < length; i++) {
            value = cb.call(obj[i], obj[i], i);
        }
    } else {
        for (i in obj) {
            value = cb.call(obj[i], obj[i], i);
        }
    }
}