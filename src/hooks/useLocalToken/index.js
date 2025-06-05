export const setToken = (data) => {
    localStorage.setItem('Stars_Token', data)
}

export const getToken = () => {
    return localStorage.getItem('Stars_Token')
}