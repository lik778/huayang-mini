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