const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const { getGoodDetail, reputation, goodSelectSku, createQRCode } = require('../../apis/products.js')
import Poster from 'wxa-plugin-canvas/poster/poster'

Page({
  data: {
    tabs:[
      {
        tabs_name: '商品简介',
        view_id: 'swiper-container'
      },
      {
        tabs_name: '商品详情',
        view_id: 'goods-des-info'
      },
      {
        tabs_name: '商品评价',
        view_id: 'reputation'
      }
    ],
    goodsId:'',
    selectSizePrice: 0,//代表售价
    selectSizeOPrice:0,//代表实际价格
    goodsDetail:{},
    toView: 'swiper-container',
    posterConfig:{},
    posterImg:'',
    showposterImg: false
  },
 
  onLoad(e) {
    // 获取商品数据
    this.data.goodsId = e.id
    this.getGoodsDetail(e.id)
  },
  // 获取商品详情的数据
  async getGoodsDetail(goodsId){
    const goodsDetailRes = await getGoodDetail(goodsId)
    if(goodsDetailRes.code === 10000){
      if(!goodsDetailRes.data.pics || goodsDetailRes.data.pics.length == 0){
        goodsDetailRes.data.pics = [{
          pic: goodsDetailRes.data.basicInfo.pic
        }]
      }
      if(goodsDetailRes.data.properties){
        this.setData({
          selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
          selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice
        })
      }
      this.setData({
        goodsDetail:goodsDetailRes.data
      })
    }
  },
  // 点击tab事件
  onTabChange(e){
    const index = e.detail.index
    this.setData({
      toView: this.data.tabs[index].view_id
    })
  },
  // 分享按钮
  onShareAppMessage(){
    let data = {
      title: this.data.goodsDetail.basicInfo.name,
      path:'/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid')
    }
    return data
  },
  // 生成页面海报
  async drawSharePic(){
    // 获取小程序二维码
    const qrcodeRes = await createQRCode()
    const qrcode = qrcodeRes.data
    // 获取商品数据
    const pic = this.data.goodsDetail.basicInfo.pic
    // 获取到商品的图片数据
    wx.getImageInfo({
      src: pic,
      success: (res)=>{
        const height = 490 * res.height / res.width
        this.drawSharePicDone(height,qrcode)
      },
      fail: (e)=>{
        console.error(e)
      }
    })
  },
  // canvas海报绘制逻辑
  drawSharePicDone(picHeight, qrcode){
    // 基准值
    const baseHeight =  picHeight + 74 + 120
    // 配置对象
    const posterConfig = {
      width: 750,
      height: picHeight + 660,
      backgroundColor: '#fff',
      debug: false,
      blocks: [{
        x: 76,
        y: 74,
        width: 604,
        height: picHeight + 120,
        borderWidth: 2,
        borderColor: '#c2aa85',
        borderRadius: 8
      }],
      images: [{
          x: 133,
          y: 133,
          url: this.data.goodsDetail.basicInfo.pic, // 商品图片
          width: 490,
          height: picHeight
        },
        {
          x: 76,
          y: baseHeight + 199,
          url: qrcode, // 二维码
          width: 222,
          height: 222
        }
      ],
      texts: [{
          x: 375,
          y: baseHeight + 80,
          width: 650,
          lineNum: 2,
          text: this.data.goodsDetail.basicInfo.name,
          textAlign: 'center',
          fontSize: 40,
          color: '#333'
        },
        {
          x: 375,
          y: baseHeight + 180,
          text: '￥' + this.data.goodsDetail.basicInfo.minPrice,
          textAlign: 'center',
          fontSize: 50,
          color: '#e64340'
        },
        {
          x: 352,
          y: baseHeight + 320,
          text: '长按识别小程序码',
          fontSize: 28,
          color: '#999'
        }
      ],
    }
    this.setData({
      posterConfig,
      showposterImg: true
    },() => {
      Poster.create(this.data.posterConfig,this)
    })
  },
  // 生成图片
  onPosterSuccess(e){
    this.setData({
      posterImg: e.detail
    })
  },
  // 保存图片到相册
  savePosterPic(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: () => {
        wx.showModal({
          content: '保存成功',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#333'
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        this.setData({
          showposterImg: false
        })
      }
    })
  },
  onShow() {
   
  },
 
})

