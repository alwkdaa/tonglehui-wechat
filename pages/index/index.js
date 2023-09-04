//先引入接口api
const { bannerList, goodsDynamic, category, notice, seckill, hotGoods, discount, collage, goodlist } = require('../../apis/products')
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
    noticeList:{},
    // 限时秒杀数据
    miaoshaGoods:[],
    // 爆品推荐
    goodsRecommend: [],
    // 疯狂砍价数据
    kanjiaList:[],
    // 全民拼团数据
    pingtuanList:[],
    // 类目
    categoryId: '',
    page:1,
    pageSize: 20,
    totalRow: 0,
    // 商品列表
    goods:[]
  },
  goSearch() {
    console.log("goserach");
  },
  // 分页获取商品列表
  async getGoodsList(){
    const { categoryId, page, pageSize} = this.data
    wx.showLoading({
      mask: true
    })
    const res = await goodlist({
      categoryId,
      page,
      pageSize
    })
    wx.hideLoading()
    this.setData({
      // 使用扩展运算符进行数组合并
      goods:[...this.data.goods, ...res.data.result],
      totalRow:res.data.totalRow
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList()
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
      if(res.code === 10000){
        this.setData({
          noticeList: res.data
        })
      }
    })

    // 获取限时秒杀数据
    seckill().then(res =>{
      console.log(res);
      //如果还没到秒杀开始时间，就显示还有多久开始，如果到秒杀时间就显示秒杀倒计时，这里对时间进行处理
      if(res.code === 10000) {
        res.data.result.forEach(el => {
          // 获取当前时间
          const _now = new Date().getTime()
          // 做一个假数据验证
          el.dateStart = '2022-04-08 13:26:21'
          el.dateEnd = '2023-9-08 13:26:21'
          // 所设置的活动开始时间大于当前时间说明活动未开始，反之活动开始
          if(el.dateStart) {
            el.dateStartInt = new Date(el.dateStart).getTime() - _now
          }
          // 当前时间与活动截止时间比较
          if(el.dateEnd){
            el.dateEndInt = new Date(el.dateEnd).getTime() - _now
          }
        })
        this.setData({
          miaoshaGoods: res.data.result
        })
      }
     
    })

    // 爆品推荐
    hotGoods().then(res => {
      this.setData({
        goodsRecommend: res.data.result
      })
    })
    // 疯狂砍价
    discount().then(res => {
      this.setData({
        kanjiaList: res.data.result
      })
    })

    // 全民拼团
    collage().then(res => {
      this.setData({
        pingtuanList: res.data.result
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
    // 拿到当前商品的数据与后端返回的商品数据进行对比
    if(this.data.goods.length >= this.data.totalRow) return
    this.setData({
      page:this.data.page + 1
    },() => {
      this.getGoodsList()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})