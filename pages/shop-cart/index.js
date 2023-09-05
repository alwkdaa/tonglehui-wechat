const { goodsInfo } = require('../../apis/products')

Page({
  data: {

  },
  onLoad() {
    
  },
  onShow() {
    this.shippingCarInfo()
  },
  // 获取购物车数据
  async shippingCarInfo() {
    const res = await goodsInfo()
    console.log(res);
  }
})