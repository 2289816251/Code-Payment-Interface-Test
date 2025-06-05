import { KJUR } from "jsrsasign";
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
export const signString = function (privateKey, data) {
    // console.log(jsrsasign)
    // 使用 jsrsasign 进行 RSA 签名
    var sig = new KJUR.crypto.Signature({alg: 'SHA256withRSA'});
    console.log(sig)

    // 使用 KEYUTIL 获取私钥对象
    // var key = KJUR.KEYUTIL.getKey(privateKey);

    // 使用私钥对象初始化签名
    sig.init(privateKey);
    sig.updateString(data);  // 用待签名字符串填充签名对象
    var signature = sig.sign();  // 获取签名结果（返回 base64 编码的签名）
    return signature;
}

// 判断是否是字节类型（例如文件或字节流）
function isByteArray(value) {
    return value instanceof ArrayBuffer || (typeof value === 'object' && value.constructor.name === 'ArrayBuffer');
}