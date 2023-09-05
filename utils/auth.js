/* 用户鉴权相关方法 */
// 引入登录相关的接口
const { checkToken,loginApi } = require('../apis/login')
const WXAPI = require('apifm-wxapi')
// 检查登录态是否过期
async function checkSession(){
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
async function bindSeller() {
  const token = wx.getStorageSync('token')
  const referrer = wx.getStorageSync('referrer')
  if (!token) {
    return
  }
  if (!referrer) {
    return
  }
  const res = await WXAPI.bindSeller({
    token,
    uid: referrer
  })
}
// 检查登录状态，返回true或false
async function checkHasLogined() {
  // 从缓存中获取token
  const token = wx.getStorageSync('token')
  // 如果没有token代表没有登录 返回false
  if (!token) {
    return false
  }
  // 检查登录态是否过期
  const loggined = await checkSession()
  if (!loggined) {
    // 清除登录缓存
    wx.removeStorageSync('token')
    return false
  }
  //判断token是否合法
  const checkTokenRes = await checkToken({ token })
  // 这里请求接口后端返回的数据，如果为-1就是非法的请求
  if(checkTokenRes.code == -1) {
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
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}
async function login(page){
  // console.log('登录')
  const _this = this
  wx.login({
    success: function (res) {
      const extConfigSync = wx.getExtConfigSync()
      if (extConfigSync.subDomain) {
        WXAPI.wxappServiceLogin({
          code: res.code
        }).then(function (res) {        
          if (res.code == 10000) {
            // 去注册
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          _this.bindSeller()
          if ( page ) {
            page.onShow()
          }
        })
      } else {
        WXAPI.login_wx(res.code).then(function (res) {        
          if (res.code == 10000) {
            // 去注册
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          _this.bindSeller()
          if ( page ) {
            page.onShow()
          }
        })
      }
    }
  })
}
// 静默登录 
async function authorize (){
  // 对外返回成功的结果 使用promise
  return new Promise(async (resolve, reject) => {
    wx.login({
      success: function (res) {
        const code = res.code
        let referrer = '' // 推荐人
        let referrer_storge = wx.getStorageSync('referrer');
        if (referrer_storge) {
          referrer = referrer_storge;
        }
        // 下面开始调用注册接口
        const extConfigSync = wx.getExtConfigSync()
        if (extConfigSync.subDomain) {
          WXAPI.wxappServiceAuthorize({
            code: code,
            referrer: referrer
          }).then(function (res) {
            if (res.code == 0) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject(res.msg)
            }
          })
        } else {
          // console.log(code, 'code')
          WXAPI.authorize({
            code: code,
            referrer: referrer
          }).then(function (res) {
            if (res.code == 0) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject(res.msg)
            }
          })
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
  
  
}
async function newAuthorize() {
  return new Promise(async (resolve, reject) => {
    const code = await wxaCode()
    const res = await loginApi({ code })
    console.log(res, 'res')
    wx.setStorageSync('token', res.token)
    wx.setStorageSync('uid', res.uid)
    resolve()
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}
async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  login: login,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize,
  authorize: authorize,
  bindSeller: bindSeller,
  newAuthorize: newAuthorize
}