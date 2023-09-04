// pages/my/index.js
// 引入封装的登录鉴权方法
const { checkHasLogined, authorize } = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 登录方法
  async login() {
    const islogin = await checkHasLogined()
    console.log(islogin,"是否登录");
    if(!islogin){
      await authorize()
      // 处理登录成功后的逻辑
    }
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