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
 * @param siteId
 * @param params 数据属性参数
 * @param ispv
 */
const bxPoint = function(siteId, params, ispv = true) {
  const commonParams = {}
  let userInfo = getLocalStorage(GLOBAL_KEY.userInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)) : {}
  let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
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
    time: +new Date(),
    site_id: siteId,
    __debug: "1", // 打点数据，测试环境携带__dev，上线后去除该字段
    // tracktype: ispv ? "pageview" : "event",
    event_type: 'huayang'
  }
  request._get('https://www.baixing.com/c/ev/huayang', params).then()
}

export default bxPoint
