/**
 * 注意事项⚠️⚠️⚠️
   1. url地址需要encodeURIComponet编译，避免接口get请求参数被截断问题
 */
import { getLocalStorage } from "./util"
import { GLOBAL_KEY } from "../lib/config"
import request from "../lib/request"


const collectKeyAry = [
  ['user', 'id'],
  ['open', 'id'],
  ['mobile'],
  ['nick', 'name'],
  ['union', 'id'],
  ['gender'],
  ['city'],
]

function stringify(object) {
  let result = ''
  Object.keys(object).forEach((key, index) => {
    result += `${key}=${object[key]}`
    result += '&'
  })
  return result.slice(0, -1)
}

function getKeyValue(keyAry = [], targetObject = {}) {
  if (keyAry.length === 0) return ''
  if (keyAry.length > 1) {
    let t1 = keyAry[0]
    let t2 = keyAry[1]
    let tempAry = [
      `${t1}${t2}`,
      `${t1}_${t2}`,
      `${t1}${t2.split('')[0].toUpperCase() +
        t2
          .split('')
          .slice(1)
          .join('')}`,
    ]
    for (let k of tempAry) {
      if (targetObject[k]) {
        return targetObject[k]
      }
    }
    return ''
  } else {
    return targetObject[keyAry[0]]
  }
}

/**
 * 打点方法
 * @param params 数据属性参数
 * @param userInfoLocalStorageKey 对应localStorage的用户信息keyName，类似"window.localStorage.getItem("xxx")中的xxx"
 * @returns {Promise<unknown>}
 */
const bxPoint = function(siteId, params, ispv = true) {
  const commonParams = {}
  let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
  let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
  userInfo = {...userInfo, ...accountInfo}
  if (userInfo) {
    collectKeyAry.forEach((collectKeyAry) => {
      commonParams[collectKeyAry.join('_')] = getKeyValue(
        collectKeyAry,
        userInfo
      )
    })
  }
  params = {
    ...commonParams,
    ...params,
    __debug: "1", // TODO 测试打点数据，上线时记得去除
    time: +new Date(),
    site_id: siteId,
    tracktype: ispv ? "pageview" : "event",
    event_type: 'huayang'
  }
  // console.log(params);
  return new Promise(resolve => {
    request._get('https://www.baixing.com/c/ev/huayang', params).then(() => {
      resolve()
    })
  })
}

export default bxPoint
