export const generateSignedString = function (params) {
    // 步骤 1: 过滤掉 `file`、`sign`、`sign_type` 和空值参数
    let filteredParams = {};

    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined && key !== 'sign' && key !== 'sign_type') {
            filteredParams[key] = params[key];
        }
    }

    // 步骤 2: 按照键名的ASCII值递增排序
    let sortedKeys = Object.keys(filteredParams).sort((a, b) => {
        return a.localeCompare(b);
    });

    // 步骤 3: 拼接参数为 `key=value` 格式，并用 & 连接
    let queryString = sortedKeys.map(key => `${key}=${filteredParams[key]}`).join('&');

    return queryString;
}

// // 判断是否是字节类型（例如文件或字节流）
// function isByteArray(value) {
//     return value instanceof ArrayBuffer || value instanceof Buffer || (typeof value === 'object' && value.constructor.name === 'Buffer');
// }