// 从定义上看，策略模式就是用来封装算法的。在实际开发中，我们通常会把算法的含义扩散开来，使策略模式可以用来封装一系列“业务规则”
// 只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式封装他们。

/**
 * 缺陷：
 * 1、onsubmit 函数庞大，需要覆盖所有校验规则
 * 2、缺乏弹性，新增或修改校验规则都需要深入函数内部，违反开放-封闭原则
 * 3、复用性差，如果增加其他表单，其他表单也需要进行类似的校验，这些校验逻辑会被复制到许多地方
 */
registerForm.onsubmit = function () {
    if (registerForm.userName.value === '') {
        // 用户名不能为空
        return false;
    } else if (registerForm.passwd.value.length < 6) {
        // 密码长度不能少于6位
        return false;
    } else if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phone.value)) {
        // 手机号格式不正确
        return false;
    }

    // submit stuff
}

// 策略模式：能够有效避免多重条件选择语句。且易于拓展，支持开放-封闭原则
const strategies = {
    isNotEmpty (value, errMsg) {
        if (value === '') {
            return errMsg;
        }
    },
    minLength (value, length, errMsg) {
        if (value.length < length) {
            return errMsg;
        }
    },
    isValidPhoneNum (value, errMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errMsg;
        }
    }
}

const validateRegisterFormInput = function () {
    // validation stuff

    return errMsg;
}

registerForm.onsubmit = function () {
    const errMsg = validateRegisterFormInput();
    if (errMsg) {
        console.log(errMsg);
        return false;
    }

    // submit stuff
}