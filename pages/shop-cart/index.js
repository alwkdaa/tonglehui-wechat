const { goodsInfo, goodSelect, delGoods, modifyNumber } = require('../../apis/products')
const TOOLS = require('../../utils/tools')
import Bigjs, { Big } from 'big.js'
Page({
  data: {
    shippingCarInfo: {},
    delBtnWidth: 120,
    // 购物车类型
    shopCarType: 1
  },
  onLoad() {
    // 处理后的删除按钮的宽度
    this.setData({
      delBtnWidth: this.getEleWidth(this.data.delBtnWidth)
    })
  },
  onShow() {
    this.shippingCarInfo()
  },
  // 获取购物车数据
  async shippingCarInfo() {
    const res = await goodsInfo()
    // 统计总价
    let totalPrice = 0
    // 对数据进行处理，计算总价
    res.items.forEach(el => {
      // 找到选中的商品
      if(el.selected){
        totalPrice += Bigjs(el.number).times(el.price).toNumber()
      }
    })
    // 购物车商品总价
    res.price = totalPrice
    this.setData({
      shippingCarInfo: res
    })
  },
  // 点击去逛逛跳转首页
  toIndexPage(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 选中商品
  async radioClick(e){
    // 获取当前索引
    const index = e.currentTarget.dataset.index
    // 找到所修改的数据
    const item = this.data.shippingCarInfo.items[index]
    await goodSelect({ key: item.pid || item.id, selected: !item.selected })
    // 重新请求数据
    this.shippingCarInfo()
    TOOLS.showTabBarBadge()
  },
  // 删除购物车商品
  async delItemDone(key){
    await delGoods({key})
    this.shippingCarInfo()
    TOOLS.showTabBarBadge()
  },
  async jianBtnTap(e){
    const index = e.currentTarget.dataset.index
    // 获取到当前数据
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number - 1
    if(number <= 0){
      // 弹出确认删除的弹窗
      wx.showModal({
        content: '确定要删除该商品吗？',
        success: (res) => {
          if(res.confirm){
            this.delItemDone(item.pid || item.id)
          }
        }
      })
    }else{
      await modifyNumber({ key: item.pid || item.id,number})
      this.shippingCarInfo()
    }
  },
  async jiaBtnTap(e){
    const index = e.currentTarget.dataset.index
    // 获取到当前数据
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number + 1
    await modifyNumber({ key: item.pid || item.id,number})
    this.shippingCarInfo()
  },
  async changeCarNumber(e){
    const index = e.currentTarget.dataset.index
    // 获取到当前数据
    const item = this.data.shippingCarInfo.items[index]
    const number = e.detail.value
    if(number){
      await modifyNumber({ key: item.pid || item.id,number})
      this.shippingCarInfo()
    }
    
    
  },
  touchS(e){
    if(e.touches.length > 0){
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },
  touchM(e){
    const moveX = e.touches[0].clientX
    let disX = this.data.startX - moveX
    let left = ""
    const delBtnWidth = this.data.delBtnWidth
    if(disX == 0 || disX < 0){
      // 当前容器不需要移动
      left = "margin-left: 0px"
    }else if(disX > 0) {
      // 移动距离大于0，说明container需要移动到手指位置
      left = "margin-left: -" + disX + 'px'
      if(disX >= delBtnWidth){
        left = "margin-left: -" + delBtnWidth + 'px'
      }
    }
    const shippingCarInfo = JSON.parse(JSON.stringify(this.data.shippingCarInfo))
    const index = e.currentTarget.dataset.index
    shippingCarInfo.items[index].left = left
    this.setData({
      shippingCarInfo: shippingCarInfo
    })
  },
  touchE(e){
    const endX = e.changedTouches[0].clientX
    const disX =this.data.startX - endX
    const delBtnWidth = this.data.delBtnWidth
    // 如果距离小于删除按钮的一半，不显示删除按钮
    const left = disX > delBtnWidth / 2 ? 'margin-left: -' + delBtnWidth + "px" : 'margin-left: 0px'
    // 获取到当前拖动的商品元素
    const index = e.currentTarget.dataset.index
    const shippingCarInfo = JSON.parse(JSON.stringify(this.data.shippingCarInfo))
    shippingCarInfo.items[index].left = left
    this.setData({
      shippingCarInfo
    })
  },
  // 获取当前元素实际的宽度
  getEleWidth(w){
    // 根据机型来做适配
    // 获取机型屏幕可用的宽度
    const res = wx.getSystemInfoSync().windowWidth
    // 窗口是px单位，需要换算成rpx
    let scale = (750 / 2 ) / (w / 2)
    
    return Math.floor(res / scale)
  }
})