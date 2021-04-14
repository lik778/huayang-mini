import request from "../../lib/request"
import {
  URL
} from "../../lib/config"

// C端用户获取弹幕列表
export const getBarrageList = params => {
  return request._get(URL.getBarrageList, params)
}

// C端创建获取弹幕
export const createBarrage = params => {
  return request._post(URL.getBarrageList, params)
}

// C端获取校友动态列表
export const getStudentCommentList = params => {
  return request._get(URL.getStudentCommentList, params)
}