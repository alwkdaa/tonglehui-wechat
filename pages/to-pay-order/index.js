const AUTH = require('../../utils/auth')
const Bigjs = require('big.js')
import { goodsInfo, createOrder } from '../../apis/products'
Page({
  data: {
    goodsList: [],
    allGoodsAndYunPrice: 0,
    orderType: '',
    peisongType: 'kd',
    name:'',
    mobile:'',
    remark:''
  },
  onShow() {
    // 校验登录的状态
    AUTH.checkHasLogined().then(isLogin => {
      if(isLogin){
        this.doneShow()
      }else{
        AUTH.newAuthorize().then(() => {
          this.doneShow()
        })
      }
    })
  },
  // 确认订单页的获取选中的商品数据
  async doneShow(){
    const res = await goodsInfo()
    // 拿到选中的商品数据
    const goodsList = res.items.filter(el => el.selected)
    let totalPrice = 0
    goodsList.forEach(el => {
      totalPrice += Bigjs(el.price).times(el.number).toNumber()
    })
    this.setData({
      goodsList:goodsList,
      allGoodsAndYunPrice: totalPrice
    })
  }, 
  // 按钮选中的方法
  radioChange(e){
    this.setData({
      peisongType: e.detail.value
    })
  },
  // 备注输入框事件
  remarkChange(e){
    this.setData({
      remark: e.detail.value
    })
  },
  // 提交订单
  async onSubmit(){
    // 提交订单调用支付按钮，需要传递参数，配送方式，备注
    const params = {
      remark: this.data.remark,
      peisongType: this.data.peisongType
    }
    if(this.data.peisongType == 'zq'){
      params.name = this.data.name
      params.mobile = this.data.mobile
    }
    // 如果是立即支付，需要传入商品支付，通过orderType判断
    if(this.data.orderType == 'buyNow'){
      params.goods = this.data.goodsList
    }
    // 这里调用下单的接口，后端会调用微信支付的接口，然后返回预支付交易的会话标识prepay_id
    const res = await createOrder(params)
    // 调用支付接口，唤起收银台，调用wx.requestPayment(Object object)方法
    wx.requestPayment({
      nonceStr: res.nonceStr,
      signType: 'RSA',
      paySign: res.paySign,
      package: 'prepay_id=' + res.prepay_id,
      timestamp:res.timestamp,
      success(){
        // 支付成功后跳转到订单列表页面
        wx.redirectTo({
          url: '/pages/order-list/index?type=1',
        })
      },
      fail() {
        console.log('微信支付失败')
      }
    })
  },

  onLoad(e) {
    // 商品详情页立即下单
    if(e.orderType){
      this.setData({
        orderType: e.orderType
      })
    }
  },
})