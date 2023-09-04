// pages/category/index.js
// 引入接口
const { category, goodlist } = require('../../apis/products')
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
    firstCategories:[],
    page: 1 ,
    pageSize:20,
    currentGoods:[],
    // 控制弹出层的弹出
    skuCurGoods: null
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
      }, () => {
        this.getGoodsList()
      })
    }
  },
  // 点击页签请求商品数据
  onCategoryClick(e) {
    const { id, index } = e.currentTarget.dataset
    // 拿到当前选中的页签数据
    const categorySelected = this.data.firstCategories[index]
    this.setData({
      page:1,
      activeCategory:index,
      categorySelected
    })
    this.getGoodsList()
  },
  // 请求商品列表数据
  async getGoodsList(){
    wx.showLoading({
      title: ''
    })
    // 获取到当前类目的id
    const { id:categoryId } = this.data.categorySelected
    const res = await goodlist({
      page:this.data.page,
      pageSize: this.data.pageSize,
      categoryId
    })
    wx.hideLoading()
    if(res.code === 10000){
      // 判断当前数据是否全部请求完成
      if(this.data.page == 1){
        this.setData({
          currentGoods: res.data.result
        })
      }else{
        this.setData({
          currentGoods: this.data.currentGoods.concat(res.data.result)
        })
      }
      
    }
    // 当前列表没有数据
    if(res.code == 700){
      if(this.data.page == 1){
        this.setData({
          currentGoods: []
        })
      }else{
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
      
    }
  },
  // 商品列表滚动到底部触发的操作
  goodsBottom(){
    this.setData({
      page:this.data.page + 1
    },() => {
      this.getGoodsList() 
    })
  },
  // 点击商品按钮选择规格或者跳转购物车
  addShopcar(e){
    const { id } = e.currentTarget.dataset
    const curGood = this.data.currentGoods.find(el => {
      return el.id = id
    })
    this.setData({
      skuCurGoods: curGood
    })
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