import request from "../../lib/request"
import { URL } from "../../lib/config"
// 获取用户信息
export const getUserInfo = (params) => {
  return new Promise(resolve => {
    request._get(URL.getUserInfo + "?" + params).then(({data}) => {
      resolve(data)
    })
  })
}
// 获取用户邀请小程序码
export const getInviteCode = (params) => {
  return new Promise(resolve => {
    request._get(URL.getInviteCode + "?" + params).then(res => {
      if (res.code === 0) {
        resolve(res.data)
      }
    })
  })
}

// 获取邀请记录
export const getInviteList=(params)=>{
  return new Promise(resolve=>{
    request._get(URL.getInviteList+"?"+params).then(res=>{
      if(res.code===0){
        resolve(res)
      }
    })
  })
}
// 获取会员编号
export const getVipNum=(params)=>{
  return new Promise(resolve=>{
    request._get(URL.getVipNum+"?"+params).then(res=>{
      if(res.code===0){
        resolve(res)
      }
    })
  })
}

// 获取客服消息场景
export const getScene=(params)=>{
  return new Promise(resolve=>{
    request._post(URL.getScene,params).then(res=>{
      if(res.code===0){
        resolve(res)
      }
    })
  })
}
// 获取大学Id跳转课程列表
export const getUniversityCode=(params)=>{
  return new Promise(resolve=>{
    request._get(URL.getUniversityCode+"?"+params).then(res=>{
      if(res.code===0){
        resolve(res)
      }
    })
  })
}
// 获取我的订单列表
export const getMineOrder=(params)=>{
  return new Promise(resolve=>{
    request._get(URL.getMineOrder+"?"+params).then(res=>{
      if(res.code===0){
        resolve(res)
      }
    })
  })
}
