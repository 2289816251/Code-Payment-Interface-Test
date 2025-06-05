export const generateOrderId = function () {
    const now = new Date();

    // 获取年月日时分秒，补零处理
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    // 生成 6 位随机数
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // 拼接订单号
    return `Stars-${year}${month}${day}${hour}${minute}${second}${randomNum}`;
}
