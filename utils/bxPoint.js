/**
 * 注意事项⚠️⚠️⚠️
   1. url地址需要encodeURIComponet编译，避免接口get请求参数被截断问题
 */

const collectKeyAry = [
  ['user', 'id'],
  ['nick', 'name'],
  ['open', 'id'],
  ['union', 'id'],
  ['sex'],
  ['city']
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
const bxPoint = function(params, userInfoLocalStorageKey = '') {
  const commonParmas = {}
  if (userInfoLocalStorageKey) {
    let userInfo = window.localStorage.getItem(userInfoLocalStorageKey)
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      collectKeyAry.forEach((collectKeyAry) => {
        commonParmas[collectKeyAry.join('_')] = getKeyValue(
          collectKeyAry,
          userInfo
        )
      })
    }
  }
  params = {
    ...commonParmas,
    ...params,
    site_id: 'huayang_morning',
    event_type: 'huayang',
  }
  return new Promise((resolve) => {
    let xhr = new XMLHttpRequest()
    xhr.open(
      'get',
      'https://www.baixing.com/c/ev/huayang?' + stringify(params),
      true
    )
    xhr.send()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve()
      }
    }
  })
}

export default bxPoint
