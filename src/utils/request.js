// 对axios进行封装
// 1. 基地址
// 2. 请求拦截器
// 3.响应拦截器
import axios from 'axios'
import { ElLoading } from 'element-plus'
import message from '@/utils/Message'
import router from '../router/index'
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";
const request = (config) => {
  // 由于发请求 传的数据不一样有的是form表单 有的是json 有的是文件
  // showLoading表示请求是加上loading效果
  let { url, params, dataType = 'form', showLoading = true} = config;
  // m默认类型是form表单
  // dataType = dataType ? 'form' : dataType
  // showLoading = showLoading ? true : showLoading
  // 定义发请求的headr头信息
  let contentType = contentTypeForm
  if (dataType === 'json') {
    // Json格式配置
    contentType = contentTypeJson
  } else if (dataType === 'file') {
    //上传文件配置
    contentType = contentTypeFile
    let param = new FormData()
    for (let key in params) {
      param.append(key, params[key])
    }
    params = param
  }
  const instance = axios.create({
    timeout: 5000,
    baseURL: '/api',
    headers: {
      'Content-type': contentType,
      'X-Request-with': 'XMLHttpRequest'
    }
  })

  // 配置q请求拦截器
  let loading = null
  instance.interceptors.request.use(
    (config) => {
      // 对config做点什么
      // 展示loading 
      if (showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: '加载中......',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }
      return config
    },
    (error) => {
      // 对错误做点什么
      if (showLoading && loading) {
        // 如果展示loading 同时loading不等于null是 关闭loading效果
        loading.close()
      }
      // ElMessage({
      //   message: '发送请求失败',
      //   type: 'error',
      // })
      message.error('发送请求失败')
      return Promise.reject(error)
    }
  )
  // 添加响应拦截器
  instance.interceptors.response.use(
    (response) => {
      // 在响应数据之前做些什么
      if (showLoading && loading) {
        loading.close()
      }
      // console.log(response, 'response')
      const responseData = response.data
      if (responseData.status === 'error') {
        if (responseData.code === 901) {
          setTimeout(()=>{
            //回到登录页面
            router.push('/login')
          },2000)
          return Promise.reject('登录超时')
        }
        // 把错误信息报出来
        if (config.errorCallback) {
          config.errorCallback();
        }
        return Promise.reject(responseData.info)
      } else {
        if (responseData.code === 200) {
          return responseData
        }

      }
      // return Promise.reject(error)
    },
    // 在响应错误之前做些什么
    // AxiosError<类型参数> 类型参数用于指定 data的类型
    (error) => {
      if (showLoading && loading) {
        loading.close()
      }
      // 经量不要用状态码code做做判断 可以用status


      // 网络没问题，且是401 token失效的问题

      return Promise.reject(error)
    }
  )
  // 对请求封装 都封装成post
  return instance.post(url, params).catch((error) => {
    message.error(error)
    return null;
  })
  // 一直不resolve 不reject 卡住了 出现的几率很小
  // let result = new Promise((resolve, reject) => {
  //   instance.post(url, params).then(res => {
  //     resolve(res)
  //   }).catch(error => {
  //     message.error(error)
  //     // ElMessage({
  //     //   message: error,
  //     //   type: 'error',
  //     // })
  //   })
  // })
  // return result
}
export default request;

