function generateRandomProductName() {
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
    return `${randomCategory}${randomItem}`;
}

export const generateRandomProducts = function (quantity) {
    const products = [];

    for (let i = 0; i < quantity; i++) {
        const productName = generateRandomProductName();
        const productId = Math.floor(Math.random() * 1e10);  // 生成10位数字商品ID
        // 生成0.01到1之间的随机价格，并保留两位小数
        const price = (Math.random() * (1 - 0.01) + 0.01).toFixed(2);  // 确保价格 >= 0.01

        const product = {
            id: productId,
            name: productName,
            price: price
        };

        products.push(product);
    }

    return products;
}