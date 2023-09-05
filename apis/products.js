// 商品相关的接口
//先将封装的request引入
import request from '../utils/request'

// banner列表
export function bannerList() {
  return request.get('/bannerList')
}

// 用户购买记录
export function goodsDynamic () {
  return request.get('/goodsDynamic')
}
// 金刚区列表
export function category(data) {
  return request.get('/category',data)
}
// 获取咨询公告接口
export function notice (pageSize=5) {
  return request.get(`/notice?pageSize=${pageSize}`)
}

// 限时秒杀接口
export function seckill() {
  return request.get('/seckill')
}
// 爆款推荐
export function hotGoods () {
  return request.get('/hotGoods')
}
// 疯狂砍价
export function discount () {
  return request.get('/discount')
}
//全民拼团
export function collage () {
  return request.get('/collage')
}
// 商品列表接口
export function goodlist ({ page, pageSize, categoryId }) {
  return request.get(`/goodlist?page=${page}&pageSize=${pageSize}&categoryId=${categoryId}`)
}
// 获取商品详情接口
export function getGoodDetail(id) {
  return request.get(`/getGoodDetail?id=${id}`)
}
// 加入购物车
export function goodSelectSku(data) {
  return request.post('/shopping-cart/goodSelectSku', data)
}
// 获取购物车的角标，也就是所添加的商品数量
export function selectGoods() {
  return request.get('/shopping-cart/selectGoods')
}

// 购物车接口
export function goodsInfo () {
  return request.get('/shopping-cart/info')
}
export function goodSelect (data) {
  return request.post('/shopping-cart/goodSelect', data)
}
export function addGoods (data) {
  return request.post('/shopping-cart/addGoods', data)
}

// 删除商品
export function delGoods (data) {
  return request.post('/shopping-cart/delGoods', data)
}
// 修改商品数量
export function modifyNumber (data) {
  return request.post('/shopping-cart/modifyNumber', data)
}