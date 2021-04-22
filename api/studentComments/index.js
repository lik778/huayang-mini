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
  return request._post(URL.createBarrage, params)
}

// C端获取校友动态列表
export const getStudentCommentList = params => {
  return request._get(URL.getStudentCommentList, params)
}

//  点赞动态
export const likeMoment = params => {
  return request._post(URL.likeMoment, params)
}

//点赞动态
export const unLikeMoment = params => {
  return request._post(URL.unLikeMoment, params)
}

// C端获取校友动态评论列表
export const getCommentList = params => {
  return request._get(URL.getCommentList, params)
}

// C端发布校友动态评论
export const publishComment = params => {
  return request._post(URL.publishComment, params)
}

// 获取校友动态详情
export const getStudentMomentDetail = params => {
  return request._get(URL.getStudentMomentDetail, params)
}