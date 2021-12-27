import request from "../../lib/request"
import {
  URL
} from "../../lib/config"

/* 获取老师信息详情 */
export const getTeacherNewInfo = (params) => {
  return request._get(URL.getTeacherNewInfo, params)
}

/* 获取老师荣誉列表 */
export const getTeacherNewHonorList = (params) => {
  return request._get(URL.getTeacherNewHonorList, params)
}

/* 获取老师动态列表 */
export const getTeacherNewMomentList = (params) => {
  return request._get(URL.getTeacherNewMomentList, params)
}

/* 获取老师动态详情 */
export const getTeacherNewMomentDetail = (params) => {
  return request._get(URL.getTeacherNewMomentDetail, params)
}

/* 删除老师动态 */
export const deleteTeacherNewMoment = (params) => {
  return request._post(URL.deleteTeacherNewMoment, params)
}

/* 获取老师留言列表 */
export const getTeacherNewCommentList = (params) => {
  return request._get(URL.getTeacherNewCommentList, params)
}

/* 发布老师留言 */
export const publishTeacherNewComment = (params) => {
  return request._post(URL.publishTeacherNewComment, params)
}

/* 删除老师留言 */
export const deleteTeacherNewComment = (params) => {
  return request._post(URL.deleteTeacherNewComment, params)
}

/* 发布动态 */
export const publishTeacherNewMoment = (params) => {
  return request._post(URL.publishTeacherNewMoment, params)
}

/* 生成二维码 */
export const createQrcode = (params) => {
  return request._post(URL.createQrcode, params)
}

/* 点赞老师 */
export const likeTeacherNew = (params) => {
  return request._post(URL.likeTeacherNew, params)
}

/* 点赞留言 */
export const likeTeacherNewComment = (params) => {
  return request._post(URL.likeTeacherNewComment, params)
}

/* 获取老师列表 */
export const getTeacherNewTeacherList = (params) => {
  return request._get(URL.getTeacherNewTeacherList, params)
}

/* 获取老师勋章列表 */
export const getTeacherNewMedalList = (params) => {
  return request._get(URL.getTeacherNewMedalList, params)
}