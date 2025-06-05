export const setOrdersList = (data) => {
    localStorage.setItem('Stars_Orders', JSON.stringify(data))
}

export const getOrdersList = () => {
    let result = localStorage.getItem('Stars_Orders')
    return JSON.parse(result)
}