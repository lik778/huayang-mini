import request from "../../lib/request"
import {
  URL
} from "../../lib/config"
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
        reject(code)
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
    request._get(URL.getMineOrder, params).then(res => {
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
    request._post(URL.pointjoinVipFrom, params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}

// 获取邀请有礼海报有效期
export const getActivityTime = (params) => {
  return new Promise(resolve => {
    request._get(URL.getActivityTime + "?" + params).then(res => {
      if (res.code === 0) {
        resolve(res)
      }
    })
  })
}



// 提现
export const withDrawFun = (params) => {
  return new Promise((resolve, reject) => {
    request._post(URL.withDraw, params).then(res => {
      if (res.code === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

// 在我的模块，获取推荐训练营列表
export function getRecommendBootcampInMine(params) {
  return new Promise((resolve, reject) => {
    request._get(URL.queryRecommendBootcampInMine, params).then(({
      data
    }) => {
      data = data || []
      resolve(data)
    })
  })
}

// 在我的模块，获取活动列表
export function getActivityInMine(params) {
  return new Promise((resolve, reject) => {
    request._get(URL.queryActivityInMine, params).then(({
      data
    }) => {
      data = data || []
      resolve(data)
    })
  })
}

// 获取活动详情
export function getActivityDetail(params) {
  return new Promise((resolve) => {
    request._get(URL.queryActivityDetail, params).then(({
      data
    }) => {
      resolve(data)
    })
  })
}

// 获取用户主题营、课程、活动数量
export function getUserOwnerClasses(params) {
  return new Promise((resolve) => {
    request._get(URL.queryUserOwnerClasses, params).then(({
      data
    }) => {
      data = data || {}
      resolve(data)
    })
  })
}

// 获取用户中心引导私域链接
export function getUserGuideLink() {
  return new Promise((resolve) => {
    request._get(URL.queryUserGuideLink).then(({
      data
    }) => {
      data = data || []
      resolve(data)
    })
  })
}

// 查询畅学卡权益
export const getFluentLearnInfo = params => {
  return request._get(URL.queryFlunetLearnInfo, params)
}

// 获取畅学卡热门课程
export const getFluentCardHotkecheng = (parasm) => {
  return request._get(URL.queryFluentCardHotkecheng, parasm)
}

// 查询畅学卡最新课程
export const getFluentCardNewkecheng = (parasm) => {
  return request._get(URL.queryFluentCardNewkecheng, parasm)
}

// 畅学卡下单
export const payForFluentCard = (parasm) => {
  return request._post(URL.payFluentCard, parasm)
}

// 查询用户畅学卡信息
export const getFluentCardInfo = (parasm) => {
  return request._get(URL.queryFluentCardInfo, parasm)
}

// 获取畅学卡分销二维码
export const getFluentQrCode = (parasm) => {
  return request._get(URL.queryFluentQrCode, parasm)
}

// 获取用户余额记录
export const getDistributeRecordList = (parasm) => {
  return request._get(URL.queryDistributeRecordList, parasm)
}

// 畅学卡会员兑换视频课程
export const getKechengWithFluentCard = (params) => {
  return request._post(URL.acceptKechengWithFluentCard, params)
}

// 获取畅学卡引导私域配置信息
export const getFluentDistributeGuide = () => {
  return request._get(URL.queryFluentDistributeGuide)
}

// 获取合伙人信息
export const getPartnerInfo = (params) => {
  return request._get(URL.queryPartnerInfo, params)
}

// 获取直接合伙人
export const getDistributeFirstList = (params) => {
  return request._get(URL.queryDistributeFirstList, params)
}

// 获取间接合伙人
export const getDistributeSecondList = (params) => {
  return request._get(URL.queryDistributeSecondList, params)
}

// 通过用户ID，查询student信息
export function getStudentInfoByUserId(params) {
  return request._get(URL.queryStudentInfoByUserId, params)
}


// //判断用户是否已经填写地址
export const checkUserHasAddress = (params) => {
  return request._get(URL.checkUserHasAddress, params)
}

// 根据手机号查询用户报名的活动
export function getUserJoinedActivitiesByMobile(params) {
  return request._get(URL.queryUserJoinedActivitiesByMobile, params)
}

// 个人中心获取师资信息
export function getUserPersonPageInfo(params) {
  return request._get(URL.queryUserPersonPageInfo, params)
}
