import request from "../../lib/request"
import { URL } from "../../lib/config"
// 获取用户信息
export const getUserInfo = (params) => {
  return new Promise((resolve, reject) => {
    request._get(URL.getUserInfo + "?" + params).then(({
      data,
      code
    }) => {
      if (code === 0) {
        resolve(data)
      } else {
        reject()
      }
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
export const getInviteList = (params) => {
  return new Promise(resolve => {
    request._get(URL.getInviteList + "?" + params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}
// 获取会员编号
export const getVipNum = (params) => {
  return new Promise(resolve => {
    request._get(URL.getVipNum + "?" + params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}

// 获取客服消息场景
export const getScene = (params) => {
  return new Promise(resolve => {
    request._post(URL.getScene, params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}
// 获取大学Id跳转课程列表
export const getUniversityCode = (params) => {
  return new Promise(resolve => {
    request._get(URL.getUniversityCode + "?" + params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}
// 获取我的订单列表
export const getMineOrder = (params) => {
  return new Promise(resolve => {
    request._get(URL.getMineOrder , params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}

// 获取加入会员背景图
export const getVipBg = () => {
  return new Promise(resolve => {
    request._get(URL.getVipBg).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}
// 获取会员权益开关
export const getVipShow = () => {
  return new Promise(resolve => {
    request._get(URL.getVipShow).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}

// 打点进入会员页路径
export const pointjoinVipFrom = (params) => {
  return new Promise(resolve => {
    request._post(URL.pointjoinVipFrom,params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}

// 获取邀请有礼海报有效期
export const getActivityTime = (params) => {
  return new Promise(resolve => {
    request._get(URL.getActivityTime+"?"+params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}



// 提现
export const withDrawFun = (params) => {
  return new Promise((resolve,reject) => {
    request._post(URL.withDraw,params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }else{
        reject(res)
      }
    }).catch(err=>{
      reject(err)
    })
  })
}

// 在我的模块，获取推荐训练营列表
export function getRecommendBootcampInMine(params) {
  return new Promise((resolve, reject) => {
    request._get(URL.queryRecommendBootcampInMine, params).then(({data}) => {
      data = data || []
      resolve(data)
    })
  })
}

// 在我的模块，获取活动列表
export function getActivityInMine(params) {
  return new Promise((resolve, reject) => {
    request._get(URL.queryActivityInMine, params).then(({data}) => {
      data = data || []
      resolve(data)
    })
  })
}

// 获取活动详情
export function getActivityDetail(params) {
  return new Promise((resolve) => {
    request._get(URL.queryActivityDetail, params).then(({data}) => {
      resolve(data)
    })
  })
}

// 获取用户主题营、课程、活动数量
export function getUserOwnerClasses(params) {
  return new Promise((resolve) => {
    request._get(URL.queryUserOwnerClasses, params).then(({data}) => {
      data = data || {}
      resolve(data)
    })
  })
}

// 获取用户中心引导私域链接
export function getUserGuideLink() {
  return new Promise((resolve) => {
    request._get(URL.queryUserGuideLink).then(({data}) => {
      data = data || []
      resolve(data)
    })
  })
}
