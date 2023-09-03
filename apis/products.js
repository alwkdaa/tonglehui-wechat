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
export function category() {
  return request.get('/category')
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