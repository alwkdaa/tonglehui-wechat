// pages/my/index.js
// 引入封装的登录鉴权方法
const { checkHasLogined, authorize } = require('../../utils/auth')
const { encrypt, getPhone } = require('../../apis/login')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    userName: ''
  },
  // 登录方法
  async login() {
    const islogin = await checkHasLogined()
    console.log(islogin, "是否登录");
    if (!islogin) {
      await authorize()
      // 处理登录成功后的逻辑
    }
  },
  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res, "用户信息");
        // 对加密数据进行解密
        encrypt(res).then(data => {
          console.log(data,'data');
          this.setData({
            avatarUrl: data.avatarUrl,
            userName: data.userName
          })
        })

      },
      fail: err => {
        console.log(err);
      }
    })
  },
  // 获取手机号
  bindgetphonenumber(e) {
    console.log(e);
    getPhone(e.detail.code).then(res=>{
      console.log(res,'res');
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})