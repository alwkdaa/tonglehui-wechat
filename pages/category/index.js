// pages/category/index.js
// 引入接口
const { category } = require('../../apis/products')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCategory:0,
    // 存储当前tab页签
    categorySelected: {
      name: '',
      id: ''
    },
    firstCategories:[]
  },
  searchScan(){
    // 扫码跳转的逻辑
    wx.scanCode({
      // 扫码的类型
      scanType: ['qrCode'],
      success (res) {
        console.log(res);
        // 跳转 通过wx.navigateTo()
        wx.navigateTo({
          url: `/pages/goods/list?name=${res.result}`,
        })
      }
    })
  },
  // 调用获取商品类目的方法
  async categorys(){
    wx.showLoading({
      title: '加载中',
    })
    const res = await category()
    // 索引
    let activeCategory = 0
    let categorySelected = this.data.categorySelected
    wx.hideLoading()
    if(res.code === 10000){
      const categories = res.data
      // 返回一级菜单
      const firstCategories = categories.filter(el => (el.level === 1))
      // 定位到当前的tab页签
      if(this.data.categorySelected.id){
        activeCategory = firstCategories.findIndex(el => {
          return el.id ===  this.data.categorySelected.id
        })
        categorySelected = firstCategories[activeCategory]
      }else{
        categorySelected = firstCategories[0]
      }
      this.setData({
        activeCategory,
        firstCategories,
        categorySelected
      })
    }
  },
  // 点击页签请求商品数据
  onCategoryClick(e) {
    const { id, index } = e.currentTarget.dataset
    // 拿到当前选中的页签数据
    const categorySelected = this.data.firstCategories[index]
    this.setData({
      activeCategory:index,
      categorySelected
    })
  },
  // 请求商品列表数据
  getGoodsList(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.categorys()
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
    // 从缓存中读取到类目的id
    const _categoryId = wx.getStorageSync('_categoryId')
    wx.removeStorageSync('_categoryId')
    if(_categoryId){
      this.data.categorySelected.id = _categoryId
      this.categorys()
    }
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