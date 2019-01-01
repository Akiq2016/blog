/* <body>
    <button id="b1">b1</button>
    <button id="b2">b2</button>
    <button id="b3">b3</button>
</body> */

// 负责安装命令
// 可以肯定点击按钮一定会做某事 不确定的是 不知道做的是什么事情
const setCommand = function (btn, command) {
    btn.onclick = function () {
        command.execute();
    };
}

// 假设有具体操作：
const MenuBar = {
    refresh() {
        console.log('refresh');
    }
}

// 对各种行为进行统一封装
const RefreshMenuBarCommand = function (receiver) {
    this.receiver = receiver;
}

RefreshMenuBarCommand.prototype.execute = function () {
    this.receiver.refresh();
}

// 接上钩子
setCommand(b1, new RefreshMenuBarCommand(MenuBar));