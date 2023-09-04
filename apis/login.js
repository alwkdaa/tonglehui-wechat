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

// 获取加密的用户信息的数据
export function encrypt(data) {
  return request.post('/encrypt',data)
}

// 解密手机号的接口
export function getPhone(data){
  return request.get(`/getPhone?code=${data}`)
}