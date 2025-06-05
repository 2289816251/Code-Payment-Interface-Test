export const generateRandomProductName = function () {
    const categories = [
        "智能", "便携", "高性能", "高清", "超薄", "迷你", "超大", "最新款"
    ];

    const items = [
        "耳机", "手表", "音响", "电视", "手机壳", "键盘", "鼠标", "背包", "充电宝", "相机"
    ];

    // 随机选择一个类别和一个商品类型
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    // 组合成商品名称
    const productName = `${randomCategory} ${randomItem}`;

    return productName;
}