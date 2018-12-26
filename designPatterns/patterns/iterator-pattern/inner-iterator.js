// 内部已经定义好迭代的规则 完全接手了整个迭代过程
// 缺点：由于内部迭代器的迭代规则已经被提前规定，所以each函数无法同时迭代2个数组
function each (arr, cb) {
    for (let i = 0, l = arr.length; i < l; i++) {
        cb.call(arr[i], arr[i], i);
    }
}

each([1, 2, 3], function(val, index) {
    console.log(val, index);
})


// 新需求：判断2个数组里的元素的值是否完全相等
// 不改写each函数本身，改写each的回调函数
function compare (arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('arr1, arr2 不相等');
    }

    each(arr1, function(val, index) {
        if (val !== arr2[index]) {
            throw new Error('arr1, arr2 不相等');
        }
    })

    console.log('arr1, arr2 相等');
}

compare([1,2,3], [1,2,4]);