export const generateSign = function (params,KEY) {
    // 1. 过滤参数
    const filtered = Object.keys(params)
        .filter(key => key !== 'sign' && key !== 'sign_type' && params[key] !== '' && params[key] !== null && params[key] !== undefined)
        .sort() // 2. 按ASCII排序

    // 3. 拼接参数字符串（不编码）
    const paramString = filtered.map(key => `${key}=${params[key]}`).join('&');

    // 4. 拼接 KEY，进行 MD5 加密（小写）
    const toSign = paramString + KEY;
    const sign = CryptoJS.MD5(toSign).toString(CryptoJS.enc.Hex);

    return sign;
}