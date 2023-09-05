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
  onSubmit(){
    
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