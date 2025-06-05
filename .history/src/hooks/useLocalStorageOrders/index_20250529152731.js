export const setOrdersList = (data) => {
    localStorage.setItem('Stars_Orders', data)
}

export const getOrdersList = () => {
    return localStorage.getItem('Stars_Orders')
}