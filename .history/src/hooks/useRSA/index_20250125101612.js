import forge from "node-forge";
export const generateSignedString = function (params) {
    // 按照键值的 ASCII 码升序排序
    const sortedParams = Object.keys(params).sort().reduce((sorted, key) => {
        sorted[key] = params[key];
        return sorted;
      }, {});

    return sortedParams;
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