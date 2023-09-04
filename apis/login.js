/* 登录相关的接口 */
// 引入request
import request from '../utils/request'

// 检查token是否合法的接口
export function checkToken(data) {
  return request.post('/checkToken', data)
}

// 获取后端会话标识接口
export function loginApi(data) {
  return request.post('/login', data)
}