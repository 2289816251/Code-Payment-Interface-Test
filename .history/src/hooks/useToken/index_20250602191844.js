import dayjs from 'dayjs'
export const generateCreativeUUID = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 设置版本（第7个字节高4位为0100）
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // 设置变体（第9个字节高2位为10）
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));

  return [
    hex.slice(0, 4).join(''),   // 8 chars (4 bytes)
    hex.slice(4, 6).join(''),   // 4 chars (2 bytes)
    hex.slice(6, 8).join(''),   // 4 chars (2 bytes)
    hex.slice(8, 10).join(''),  // 4 chars (2 bytes)
    hex.slice(10, 16).join('')  // 12 chars (6 bytes)
  ].join('-');
}