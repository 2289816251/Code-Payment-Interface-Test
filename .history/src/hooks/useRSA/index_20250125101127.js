import forge from "node-forge";
export const generateSignedString = function (params) {
    // 步骤 1: 过滤掉 `file`、`sign`、`sign_type` 和空值参数
    let filteredParams = {};

    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined && key !== 'sign' && key !== 'sign_type' && !isByteArray(params[key])) {
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

// 步骤 4: 使用 RSA 私钥进行签名
export const signString = function (merchantPrivateKey, data) {

    console.log(`待签字符串：${data}`)
    console.log(`商户公钥：${merchantPrivateKey}`)

    const signData = forge.util.createBuffer(data, 'utf8');
    const privateKey = forge.pki.privateKeyFromPem(merchantPrivateKey);
    const signature = privateKey.sign(forge.md.sha256.create().update(signData).digest());

    // 转换为 Base64 格式签名
    let sign = forge.util.encode64(signature);
    console.log("生成的签名:", sign);
}

// 判断是否是字节类型（例如文件或字节流）
function isByteArray(value) {
    return value instanceof ArrayBuffer || (typeof value === 'object' && value.constructor.name === 'ArrayBuffer');
}