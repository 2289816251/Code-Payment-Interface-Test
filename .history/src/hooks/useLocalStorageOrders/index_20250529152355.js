function setOrdersList(data){
    localStorage.setItem('Stars_Orders',data)
}

function getOrdersList(){
    return localStorage.getItem('Stars_Orders')
}