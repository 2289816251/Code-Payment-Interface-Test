import jsrsasign from "jsrsasign";
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

// 步骤 4: 使用 RSA 私钥进行签名
function signString(privateKey, data) {
    // 使用 jsrsasign 进行 RSA 签名
    let sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
    sig.init(privateKey);  // 初始化签名对象，传入私钥
    sig.updateString(data);  // 用待签名字符串填充签名对象
    let signature = sig.sign();  // 获取签名结果（返回 base64 编码的签名）
    return signature;
}

let privateKey = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/teaoKtNfYKptOTGqGMEkzVcxI4OUvA0XvmajMDjoioUHX7stEwfLEnU8wHzijT7qQJymh0x7xf2h8hmIZ2e48PSLw/mZWf24iiZOt5F5ln2un37ULrvq2r2VI0vg5oMikkVftI0JI/eX+Y80G/8s0MqZ5AGFYKiVkXKR7SVftsaIp2jgvOkni/Qt4VJ+nrPCAWwbjQzzMLas2K/2ozF4Zas2krHHjvdfha02XrXoRIORPOFXqFPa+PMODJZklOgGfoX32xipfrOTs9Scc4FXV/hsaLuR5TSFkHAUXxUqLQR64zaxukUoth8PLCsLMh/GQnzTuOxuI++C6y32Ke6JAgMBAAECggEAW/Caq+/N6yHq2fLh9JdmmYW42SIVCpGdHdP8WSrZP/yei8jHdXh49lTl0Lrnqabfk2xlNCAS+BEd8DqxMA+XWMSGIzlbTMYxvfzTHlE+/TbFE6f+JTg8ewdogEurKjKilUPc7WcjdEzBgyr2GKGMoSuI3oDQkeynLQPSFFXM5LdnCx7BANYeeOrwJqjSG+977Q7p/woSk4250y+LaTGwVO+f5MxziaW6bNw/DhzSNCZ20EArvRUUPf5EpPUbtWi43yN+DSi6PNkx0e5vS2SoufRSH2NFghJHebWk3eZ9FxNDXOw/5PCf+ksqrM+J06KvAYpCYW/dNT6mibXmiUOiYQKBgQD7qhbhY7NO1+/hdIP+pFWdsRJFoc0jWUcarG3d24X8zDZB5z8PNAzX+raiDxx3DOnac3tWK+Qzy1LreMBtqX7LbVJrQhlcivK4SSmGT4aixE6+J8YpPf1T7d4XbIK8Y9iWqp4sStLbu0hjzM7hBrsv4rUmKOEIl1IX9yvC03q1LQKBgQDDA2X2R/zSFH9YSVAX+usC+Ds/1vpMsoZG6SChZG1bdFOZ8ujmLfpHQEOyujagyRI124MeqxEu6LX9IZcnU10FQXJe1IXGkJUlxEp4kys6K0JXHtBv+iYPgiK6PM6W/YzzyEpo5Dx85ywKqF8oRVxH986ITlRXdS11q+772Q0wTQKBgQCPeK5GnEIy5qQY0gYV+7XbioEyNUXvqwwARuDzpBzEu98KvzyR/Eh+MK5BwX+m1zPSmBduTuNwK7AAEf0SB5kDfDWKdEplGcm6CeukaF4HGQcTHTW5eV+co3UDwZbes8VcT7SQ569CGYjxbGdcnivE5ugC8zcnYK0qgHzwOwQvmQKBgFd027JCgIh6ds3SOyA2AFVZm8C6mY/x9DQy8tZOYpjEJ4YAISCxd++iS3oI9tzOr+MFad1EHLWr2YoHGXGiejIUMsWCi+gMCUdhq4A9iAJTSjIl+JZvWchUtVxOTtv6I89kgLJfwRzG08KH1f0KdiM0aCRK9JowS83c6JV7tuV1AoGBANhGMTKR0TJqLGhreAQW+lJg2Bbzss8VUakzKcONHHSEoeK+9DAjqAbDfjFIH+xOlv2EKDz1oL5PN8UDSlCpVSq1k2AMcESnBTnNdDB1+INhDHIOo38x3C7F46woFgJwgBid3ReZUJlarW5BZiiGTA2AP4NoPR4Gsmz9l7vup5Cq'

// // 判断是否是字节类型（例如文件或字节流）
// function isByteArray(value) {
//     return value instanceof ArrayBuffer || value instanceof Buffer || (typeof value === 'object' && value.constructor.name === 'Buffer');
// }