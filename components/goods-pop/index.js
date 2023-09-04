const { getGoodDetail } = require('../../apis/products')
Component({
  data: {
    show: false,
    skuCurGoods: []
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
      // 隐藏tabBar
      wx.hideTabBar()
      const skuCurGoods = skuCurGoodsRes.data
      skuCurGoods.basicInfo.storesBuy = 1
      this.setData({
        show: true,
        skuCurGoods 
      })
    },
    // 弹出层关闭
    onClose(){
      this.setData({
        show:false
      },() => {
        wx.showTabBar()
      })
   
    },
    // 选择规格
    skuSelect(e) {
      // 修改原数据，添加高亮的属性,使用深拷贝
      const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
      // 拿到第一级索引和具体的规格选项索引
      const { propertyindex, propertychildindex} = e.currentTarget.dataset
      // 先拿到第一级的数据
      const property = skuCurGoods.properties[propertyindex]
      // 具体规格选项的数据
      const child = property.childsCurGoods[propertychildindex]
      // 当前位置往下的所有sku取消选中状态,通过遍历第一级规格
      for(let index = propertyindex;index < skuCurGoods.properties.length;index++){
        // 拿到当前所遍历的元素
        const element = skuCurGoods.properties[index]
        // 然后清除下面选中的规格
        element.childsCurGoods.forEach(child => {
          child.active = false
        })
      }
      // 处理选中的元素，给选中的元素添加active字段，后续通过这个字段来判断
      property.childsCurGoods.forEach(el => {
        if(el.id === child.id){
          el.active = true
        }else{
          el.active = false
        }
      })
      this.setData({
        skuCurGoods
      })
    },
    // 数量增加
    storesJia(){
      const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
      //判断购买数量是否是小于库存
      if(skuCurGoods.basicInfo.stores > skuCurGoods.basicInfo.storesBuy){
        skuCurGoods.basicInfo.storesBuy += 1
        this.setData({
          skuCurGoods
        })
      }
    },
    // 数量减少
    storesJian(){
      const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
      if(skuCurGoods.basicInfo.storesBuy > 1){
        skuCurGoods.basicInfo.storesBuy -= 1
        this.setData({
          skuCurGoods
        })
      }
    },
    // 加入购物车按钮
    addCarSku(){

    }
  }
})