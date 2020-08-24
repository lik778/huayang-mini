import {
  GLOBAL_KEY
} from "../../lib/config"
import request from "../../lib/request"
import {
  getPhoneNumber,
  getSignData,
  getTaskList,
  increaseExp,
  needUpdateUserInfo,
  taskCheckIn
} from "../../api/course/index"
import {
  getUserInfo
} from "../../api/mine/index"
import {
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  setLocalStorage
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    didShowAuth: false,
    statusHeight: 0,
    noUserInfo: true,
    nodata: true,
    taskList: [],
    canShow: false,
    processStyle: "width:0%;",
    taskStyle: "",
    phoneNumber: "",
    functionStyle: "",
    hasCheckIn: false,
    showMessage: false,
    showAll: false,
    fromOrderButton: false,
    baseUrl: '',
    gradeData: {
      experNum: 0,
      upgrade: false,
      text02: "",
      text03: "",
      showLevelAlert: false
    }
  },
  // 获取用户信息
  getUserSingerInfo() {
    getUserInfo('scene=zhide').then(res => {
      this.needUpdateUserInfo(res).then(() => {
        setLocalStorage(GLOBAL_KEY.accountInfo, res)
        let data = parseInt((res.user_experience / res.next_level_experience) * 100)
        this.setData({
          userInfo: res,
          processStyle: `width:${data}%;`,
        })
      })

    })
  },
  // 获取授权
  getAuth() {
    this.setData({
      didShowAuth: true
    })
  },
  // 用户授权取消
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 用户确认授权
  authCompleteEvent() {
    this.initFun()
    this.setData({
      didShowAuth: false,
      noUserInfo: false
    })
    if (this.data.fromOrderButton) {
      this.setData({
        fromOrderButton: false
      })
      wx.navigateTo({
        url: '/mine/mineOrder/mineOrder',
      })
    }
  },
  // 判断是否需要填写用户资料
  needUpdateUserInfo(res) {
    return new Promise(resolve => {
      needUpdateUserInfo({
        user_id: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id
      }).then(res1 => {
        // res===false不需要显示完善资料
        // res1 = true
        if (!res1) {
          // false不需要显示完善资料
          this.setData({
            taskStyle: "top:-138rpx",
            functionStyle: "top:-138rpx"
          })
          if (getLocalStorage(GLOBAL_KEY.showFillMsg) !== undefined) {
            // 说明刚刚完善资料,弹弹窗
            let userInfoLate = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
            if (userInfoLate.user_grade < res.user_grade) {
              // 完善资料升级了
              this.setData({
                gradeData: {
                  experNum: res.user_grade,
                  upgrade: true,
                  text02: "",
                  text03: "",
                  showLevelAlert: true
                }
              })
            } else {
              // 完善资料未升级
              this.setData({
                gradeData: {
                  experNum: 100,
                  text02: "完善资料成功",
                  text03: res.user_grade < 3 ? `还差${res.next_level_experience-res.user_experience}升至Lv${res.user_grade+1}` : "",
                  upgrade: false,
                  showLevelAlert: true
                }
              })
            }
          }
          wx.removeStorage({
            key: GLOBAL_KEY.showFillMsg
          })
        } else {
          setLocalStorage(GLOBAL_KEY.showFillMsg, true)
        }
        this.setData({
          showMessage: res1,
          showAll: true
        })
        resolve()
      })
    })

  },
  // 完善个人资料
  fullSelfMsg() {
    let webViewData = JSON.stringify({
      userId: getLocalStorage(GLOBAL_KEY.userId),
      open_id: getLocalStorage(GLOBAL_KEY.openId),
    })
    let data = `${request.baseUrl}/#/home/zhideFillSelfInfo?data=${webViewData}`
    data = encodeURIComponent(data)
    bxPoint("mine_data", {})
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${data}&type=link`,
    })
  },
  // 获取签到信息
  getSignData() {
    getSignData({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      time: Math.round(new Date() / 1000),
      scene: "zhide_center"
    }).then(res => {
      this.setData({
        canShow: true
      })
      if (res.id) {
        this.setData({
          hasCheckIn: true
        })
      }
    })
  },
  // 签到
  checkin(e) {
    bxPoint("mine_task", {
      task_type: "signIn"
    }, false)
    let experNumData = Number(e.currentTarget.dataset.type.textData2.split("+")[1])
    taskCheckIn({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      scene: 'zhide_center'
    }).then(res => {
      this.setData({
        hasCheckIn: true
      })
      increaseExp({
        task_type: 'task_checkin'
      }).then(res => {
        this.getUserSingerInfo()
        if (res.has_grade) {
          // 签到升级了
          this.setData({
            gradeData: {
              experNum: res.level,
              upgrade: true,
              text02: "",
              text03: "",
              showLevelAlert: true
            }
          })
        } else {
          // 未升级
          this.setData({
            gradeData: {
              experNum: experNumData,
              text02: "签到成功",
              text03: res.level < 3 ? `还差${res.next_experience - res.experience}升至Lv${res.level+1}` : "",
              upgrade: false,
              showLevelAlert: true
            }
          })
        }
      })
    })
  },
  //
  // 训练/打卡
  pratice() {
    bxPoint("mine_task", {
      task_type: "toTrain"
    }, false)
    wx.switchTab({
      url: '/pages/practice/practice',
    })
  },
  // 获取个人信息
  getUserInfo() {
    this.setData({
      userInfo: getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
    })
  },
  // 去邀请
  invite() {
    bxPoint("mine_task", {
      task_type: "toInvite"
    }, false)
  },
  // 获取任务列表
  getTaskList() {
    getTaskList().then(res => {
      for (let i in res) {
        let str = res[i].DescExperience.split("+")
        for (let j in str) {
          j = Number(j)
          if (j === 0) {
            res[i].textData1 = str[j]
          } else if (j === 1) {
            res[i].textData2 = "+" + str[j].split('成长值')[0]
            res[i].textData3 = "成长值" + str[j].split('成长值')[1]
          }
        }
      }
      this.setData({
        taskList: res
      })
    })
  },
  // 我的订单
  toOrder() {
    if (hasUserInfo() && hasAccountInfo()) {
      wx.navigateTo({
        url: '/mine/mineOrder/mineOrder',
      })
    } else {
      this.setData({
        didShowAuth: true,
        fromOrderButton: true
      })
    }
  },

  // 获取客服号码
  getNumber() {
    getPhoneNumber().then(res => {
      this.setData({
        phoneNumber: res
      })
    })
  },
  //公用方法
  initFun() {
    this.getUserInfo()
    this.getSignData()
    this.getNumber()
    this.getUserSingerInfo()
  },
  // 联系客服
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    this.setData({
      statusHeight: data,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    if (hasUserInfo() && !hasAccountInfo()) {
      // 有微信信息没有手机号信息
      this.setData({
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)),
        noUserInfo: true,
        nodata: false,
      })
    } else if (hasUserInfo() && hasAccountInfo()) {
      // 有微信信息且有手机号信息
      this.initFun()
      this.setData({
        noUserInfo: false,
        nodata: false
      })
    } else {
      // nothing
      this.setData({
        noUserInfo: true,
        nodata: true
      })
    }
    this.getTaskList()
    bxPoint("applets_mine", {})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '跟着花样一起变美，变自信',
      path: `/pages/discovery/discovery?invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}`
    }
  }
})