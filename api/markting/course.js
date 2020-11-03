import request from "../../lib/request"
import {
  URL
} from "../../lib/config"

// 获取推广训练营/课程列表
export const getTakeoutList = params => {
  return new Promise(resolve => {
    request._get(URL.getTakeoutList, params).then(res => {
      resolve(res)
    })
  })
}

// 提现
export const kechengTakeout = params => {
  return new Promise(resolve => {
    request._get(URL.kechengTakeout, params).then(res => {
      resolve(res)
    })
  })
}