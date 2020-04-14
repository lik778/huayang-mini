import request from "../../lib/request"
import {
  URL,
  GLOBAL_KEY
} from "../../lib/config"
import {
  toast,
  setLocalStorage,
  getLocalStorage
} from "../../utils/util"
// 获取用户信息
export const getUserInfo = (params) => {
  return new Promise(resolve => {
    request._get(URL.getUserInfo + "?" + params).then(({
      data
    }) => {
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