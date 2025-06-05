import request from '../request'

// 获取文心一言
function getAWordFromTheHeart () {
    return request({
        method:'get',
        url:`/home/getAWordFromTheHeart`
    })
}

// 获取SetUp
function getSetUp () {
    return request({
        method:'get',
        url:`/home/getSetUp`
    })
}

export default {
    getAWordFromTheHeart,
    getSetUp
}