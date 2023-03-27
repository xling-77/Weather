import axios from 'axios'
// import qs from 'qs'
import url from './url'
import {localStore, cacherules} from './cache'

// 创建请求实例：apit
const apit = axios.create({timeout: 5000})
apit.interceptors.request.use((config) => {
  let reConfig = cacherules(config) // 判断缓存是否命中
  return reConfig
}, (err) => {
  return Promise.reject(err)
})
apit.interceptors.response.use(response => {
  let code = parseInt(response.data.code)
  if (code === 200) {
    localStore(response, 0.003) // 缓存数据--5mins
    return response
  } else {
    return Promise.reject(response.data.msg)
  }
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  if (axios.isCancel(error)) {
    return Promise.resolve(JSON.parse(error.message))
  }
  return Promise.reject(error.message)
})

// 创建请求实例：apiy
const apiy = axios.create({timeout: 5000})
apiy.interceptors.request.use((config) => {
  let reConfig = cacherules(config) // 判断缓存是否命中
  return reConfig
}, (err) => {
  return Promise.reject(err)
})
apiy.interceptors.response.use(response => {
  // 2xx 范围内的状态码都会触发该函数。
  if (response.status === 200) {
    localStore(response, 0.5) // 缓存数据--12h
    return response
  } else {
    return Promise.reject(response.data)
  }
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  if (axios.isCancel(error)) {
    return Promise.resolve(JSON.parse(error.message))
  }
  return Promise.reject(error)
})

// 存放获取数据的方法
const api = {
  // 获取天气数据
  getTWea1 (areaid) {
    return apit.get(url.tianqi, {
      params: {
        city: areaid,
        type: '1' // 实时1，七天7
      }
    })
  },
  getTWea7 (areaid) {
    return apit.get(url.tianqi, {
      params: {
        city: areaid,
        type: '7' // 实时1，七天7
      }
    })
  },
  getYWea1 (areaid) {
    return apiy.get(url.Ytianqi1, {
      params: {
        cityid: areaid
      }
    })
  },
  getYWea7 (areaid) {
    return apiy.get(url.Ytianqi7, {
      params: {
        cityid: areaid
      }
    })
  }
}
export default api
