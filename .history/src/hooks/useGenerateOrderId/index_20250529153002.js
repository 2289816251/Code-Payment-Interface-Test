export const generateOrderId = function () {
    // 获取当前时间戳（精确到毫秒）
    const timestamp = Date.now();

    // 获取随机数（生成一个4位数的随机数）
    const randomNum = Math.floor(Math.random() * 10000);

    // 获取UUID（一个简单的UUID生成方式）
    const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (timestamp + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    // 生成前缀，可以根据业务需要修改
    const prefix = 'Stars';

    // 组合并返回一个复杂的订单号
    return `${prefix}-${timestamp}-${randomNum}-${uuid}`;
}
