// 商品相关的接口
//先将封装的request引入
import request from '../utils/request'

// banner列表
export function bannerList() {
  return request.get('/bannerList')
}