const { getGoodDetail, goodSelectSku } = require('../../apis/products')
const TOOLS = require('../../utils/tools')
Component({
  data: {
    show: false,
    skuCurGoods: [],
    skuGoodsPic:""
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
        skuCurGoods,
        skuGoodsPic: skuCurGoods.basicInfo.pic
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
      // 选择不同的规格显示不同的图片
      // 先拿到当前的数据
      let skuGoodsPic = this.data.skuGoodsPic
      // 当规格图片数据存在时显示
      if(skuCurGoods.subPics && skuCurGoods.subPics.length > 0){
        const _subPic = skuCurGoods.subPics.find(el => {
          return el.optionValueId == child.id
        })
        if(_subPic){
          skuGoodsPic = _subPic.pic
        }
      }
      this.setData({
        skuCurGoods,
        skuGoodsPic
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
    async addCarSku(){
      // 先对数据校验，校验是否存在未选中的sku，只有将规格都选上了才能添加购物车，checkSkuSelect（）方法校验
      // 将当前商品传递进去，应该让这个方法返回true或false
      if(!this.checkSkuSelect(this.data.skuCurGoods)){
        wx.showToast({
          title: '请选择规格/配件',
          icon: 'none'
        })
        return
      }
      // 加入购物车
      await goodSelectSku({ goodInfo: this.data.skuCurGoods, pic: this.data.skuGoodsPic })
      wx.showToast({
        title: '加入成功',
      })
      TOOLS.showTabBarBadge()
      wx.showTabBar()
      this.setData({
        show:false
      })
    },
    // 接收当前商品的数据
    checkSkuSelect(product) {
      let flag = false
      if(product.properties && product.properties.length > 0){
        // 定义一个变量记录每一个规格选中的结果
        const checkResult = []
        // 判断的逻辑就是判断是否存在active，因为之前给选中的规格都添加了active字段代表选中
        product.properties.forEach((item,index) => {
          checkResult.push(false)
          item.childsCurGoods.forEach(child => {
            if(child.active){
              checkResult[index] = true
            }
          })
        })
        if(checkResult.length === 0){
          flag = true
        }else{
          flag = !checkResult.filter(el => !el).length
        }
      }
      return flag
    }
  }
})