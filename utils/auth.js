/* 用户鉴权相关方法 */
// 引入登录相关的接口
const { checkToken,loginApi } = require('../apis/login')
// 检查登录态是否过期
async function checkSession () {
  // 想要拿到checkSession的成功和失败，在这里使用返回一个Promise对象
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检查登录状态，返回true或false
async function checkHasLogined() {
  // 从缓存中获取token
  const token = wx.getStorageSync('token')
  // 如果没有token代表没有登录 返回false
  if(!token) return false
  // 检查登录态是否过期
  const loggined = await checkSession()
  if(!loggined){
    // 清除登录缓存
    wx.removeStorageSync('token')
    return false
  }
  //判断token是否合法
  const checkTokenRes = await checkToken({ token })
  // 这里请求接口后端返回的数据，如果为-1就是非法的请求
  if(checkTokenRes == -1) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

// 微信登录
async function wxaCode() {
  // 想要获取微信登录接口的内层信息，可以使用返回一个promise对象的形式
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res.code)
      }
    })
  })
}

// 静默登录 
async function authorize (){
  // 对外返回成功的结果 使用promise
  return new Promise(async (resolve, reject) => {
    const code = await wxaCode()
    const res = await loginApi({ code })
    // 这里就能拿到token，如果没有这个用户后端会创建一个token返回
    // 将获取到的token以及uid也就是openid放在缓存里
    // uid是用户的唯一标识
    wx.setStorageSync('token', res.token)
    wx.setStorageSync('uid', res.uid)
    resolve()
  })
  
  
}

module.exports = { checkHasLogined, authorize }