import dayjs from 'dayjs'
export const generateCreativeUUID =  ()=> {
  // 生成一个 16 字节（128 位）的随机数
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 按照 RFC 4122 第4版规范设置版本号和变体位
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // 设置 UUID 版本号为 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // 设置变体为 10xx

  // 转换为符合格式的字符串：8-4-4-4-12
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
  return [
    hex.slice(0, 4).join('') + hex.slice(4, 6).join(''), // 8
    hex.slice(6, 8).join(''),                           // 4
    hex.slice(8, 10).join(''),                          // 4
    hex.slice(10, 12).join(''),                         // 4
    hex.slice(12, 16).join('')                          // 12
  ].join('-');
}