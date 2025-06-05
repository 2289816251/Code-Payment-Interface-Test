function setOrders(data){
    localStorage.setItem('Stars_Orders',data)
}

function getOrders(){
    return localStorage.getItem('Stars_Orders')
}