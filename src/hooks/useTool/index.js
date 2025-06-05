export const filterMatchingKeys =  function (keysArray, dataArray) {
    // 将第一个数组转换为Set以便快速查找
    const keySet = new Set(keysArray);
    
    // 过滤第二个数组，只保留key匹配的对象
    return dataArray.filter(item => {
        // 提取每个对象的key值（注意数据结构层级）
        const itemKey = item.key;
        // 检查key是否存在于第一个数组中
        return itemKey !== undefined && keySet.has(itemKey);
    });
}