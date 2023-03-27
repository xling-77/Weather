import axios from 'axios'

// 检测 **Storage 是否同时受支持和可用的函数storageAvailable
function storageAvailable (type) {
  var storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof DOMException && (
    // everything except Firefox
      e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0)
  }
}

// 返回符合规则的缓存数据
let backIndex = ''
let backData = []

// 对数据进行缓存的函数localStore。默认在响应拦截器中使用，若在其它地方使用，需更改缓存索引cacheIndex。（有调用函数storageAvailable：检测 sessionStorage 是否同时受支持和可用的函数）
function localStore (response, timeDays) {
  if (storageAvailable('sessionStorage')) {
    let cacheIndex = '' // 缓存数据的索引，即sessionStorage{cacheIndex:cacheData}（键，值）
    let cacheData = [] // 缓存列表[{expiretime:过期时间,response:response内容}]
    let cacheObj = {} // {expiretime:过期时间,response:response内容}
    let expiretime = 0 // 过期时间（毫秒数）

    // 根据输入timeDays参数来设置过期时间（毫秒数）
    if (parseFloat(timeDays) < 0) {
      expiretime = Date.now() // 实时请求
    } else if (parseFloat(timeDays) < 1) {
      expiretime = Date.now() + 24 * 60 * 60 * 1000 * parseFloat(timeDays) // 过期时间（毫秒数）：< 1d
    } else {
      expiretime = Date.now() + 24 * 60 * 60 * 1000 * Math.round(timeDays) // 过期时间（毫秒数）：>= 1d
    }

    // 判断响应内容是否符合条件：200。符合条件即推入缓存
    if (response.status === 200) {
      cacheIndex = JSON.stringify(response.config.url + response.config.method + JSON.stringify(response.config.params)) // 编码缓存索引：将请求url、方法、参数组合在一起。
      // 设置缓存数据，其结构为[{expiretime:过期时间,response:response内容}]
      cacheObj.expiretime = expiretime
      cacheObj.response = response
      cacheData.push(cacheObj)
      // 将数据保存在本地
      sessionStorage.setItem(cacheIndex, JSON.stringify(cacheData))
    }
  }
  return response
}

// 缓存命中规则函数。默认在请求拦截器中使用，若在其它地方使用，需更改编码索引curReqIndex。
function cacherules (params) {
  // 取消请求的配置
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  // 编码索引：将请求url、方法、参数组合在一起
  let curReqIndex = JSON.stringify(params.url + params.method + JSON.stringify(params.params))

  // 根据编码后的索引查找本地缓存，看是否有该请求的缓存，即缓存命中：请求url、方法、参数一致+缓存没过期 = 需要的缓存数据
  if (sessionStorage.getItem(curReqIndex)) {
    let pastData = JSON.parse(sessionStorage.getItem(curReqIndex)) // 获取因该条请求缓存的所有数据[{expiretime:过期时间,response:params内容}]
    let cacheExTime = [] // 存放处理后的时间数据：缓存数据中的过期时间expiretime - 现在时刻

    // 接下来找未过期的数据(>0)，而且要找出那个最慢过期的数据(max)。
    pastData.forEach(el => {
      cacheExTime.push(new Date(el.expiretime) - Date.now())
    })
    if (Math.max(...cacheExTime) > 0) {
      // 为本次请求参数添加取消请求的标识：cancelToken
      params.cancelToken = source.token
      // 返回符合规则的缓存数据
      backIndex = cacheExTime.indexOf(Math.max(...cacheExTime))
      backData = pastData[backIndex].response

      // 取消本次请求，并将缓存数据通过source.cancel()传递，即error.message里存放缓存数据。取消请求后，状态码会超出200，被响应拦截器处理。
      source.cancel(JSON.stringify(backData))
    } else {
      sessionStorage.removeItem(curReqIndex) // 清除过期数据
    }
  }
  return params
}

export {localStore, cacherules}
