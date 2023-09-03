//先引入接口api
const { bannerList, goodsDynamic, category, notice } = require('../../apis/products')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    banners: [],
    // 用户购买记录数据
    goodsDynamic: [],
    // 金刚区数据
    categories: [],
    // 咨询公告数据
    noticeList:[]
  },
  goSearch() {
    console.log("goserach");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    bannerList().then(res => {
      if (res.code === 10000) {
        this.setData({
          banners: res.data
        })
      }
    })
    // 获取用户购买记录
    goodsDynamic().then(res => {
      if (res.code === 10000) {
        this.setData({
          goodsDynamic: res.data
        })
      }
    })
    // 获取金刚区数据
    category().then(res => {
      if(res.code === 10000){
        this.setData({
          categories: res.data
        })
      }
    })
    // 咨询公告
    notice().then(res => {
      console.log(res);
      this.setData({
        noticeList: res.data
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})