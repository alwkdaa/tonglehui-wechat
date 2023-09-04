const { getGoodDetail } = require('../../apis/products')
Component({
  data: {
    show: false
  },
  // 父子间传进来的数据
  properties: {
    skuCurGoodsBaseInfo: null
  },
  // 对skuCurGoodsBaseInfo进行监听
  observers: {
    'skuCurGoodsBaseInfo': function (skuCurGoodsBaseInfo){
      if(!skuCurGoodsBaseInfo){
        return
      }
      // 判断当前商品是否能够购买，根据数据中的stores判断，代表商品的库存
      if(skuCurGoodsBaseInfo.stores <= 0){
        wx.showModal({
          title: '已售罄',
          icon: 'none'
        })
        return
      }
      // 获取到商品的规格
      this.initGoodsData(skuCurGoodsBaseInfo)
    }
  },
  methods: {
    async initGoodsData(skuCurGoodsBaseInfo) {
      // 请求商品详情数据
      const skuCurGoodsRes = await getGoodDetail(skuCurGoodsBaseInfo.id)
      console.log(skuCurGoodsRes,'skuCurGoodsRes');
    } 
  }
})