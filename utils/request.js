/* flyio二次封装 */
// 引入flyio
import Fly from 'flyio'

// 第一步先创建实例
const fly = new Fly()

// 配置后端请求地址
fly.config.baseURL = "https://www.winweb.cloud/mall"
// 超时时间
fly.config.timeout = 1000 * 20

// 自定义错误类
class RequestError extends Error {
  constructor(message,code) {
    super(message)
    this.code = code
    this.data = data
  }
}

// 对接口请求和响应进行拦截

//添加请求拦截器
fly.interceptors.request.use((request) => {
  //给所有请求添加自定义header

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    //处理请求异常的逻辑
    // 非200的请求拦截
    const { status, data } = response
    if(status !==200){
      const message = '[Fetch]: 网络开小差'
      return Promise.reject(new RequestError(message))
    }
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    //发生网络错误后会走到这里
    if(!err) err ={}
    err.message = '网络异常，请稍后再试'
    setTimeout(() => {
      wx.showToast({
        title: err.message,
        icon:'none',
        duration: 2000
      })
    },100)
    return Promise.reject(err)
  }
)

//对外暴露fly实例
export default fly