// pages/userCenter/userCenter.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import request from "../../lib/request"
import {
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
  setLocalStorage
} from "../../utils/util"
import {
  checkAuth
} from "../../utils/auth"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    statusHeight: 0,
    taskList: [],
    canShow: false,
    processStyle: "width:0%;",
    taskStyle: "",
    functionStyle: "",
    hasCheckIn: false,
    showMessage: false,
    showAll: false,
    baseUrl: '',
    gradeData: {
      experNum: 0,
      upgrade: false,
      showLevelAlert: false
    }
  },
  // 获取用户信息
  getUserSingerInfo() {
    getUserInfo('scene=zhide').then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      let data = parseInt((res.user_experience / res.next_level_experience) * 100)
      this.setData({
        userInfo: res,
        processStyle: `width:${data}%;`,
      })
    })
  },
  // 判断是否需要填写用户资料
  needUpdateUserInfo() {
    needUpdateUserInfo({
      user_id: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id
    }).then(res => {
      // res=true
      if (!res) {
        this.setData({
          taskStyle: "top:-74rpx",
          functionStyle: "top:-74rpx"
        })
      }
      this.setData({
        showMessage: res,
        showAll: true
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
    console.log(e)
    let experNumData = Number(e.currentTarget.dataset.type.textData1.split("+")[1].split("成长值")[0])
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
          // if (false) {
          // 升级了
          this.setData({
            gradeData: {
              experNum: experNumData,
              upgrade: true,
              showLevelAlert: true
            }
          })
        } else {
          // 未升级
          this.setData({
            gradeData: {
              experNum: experNumData,
              upgrade: false,
              showLevelAlert: true
            }
          })
        }
        setTimeout(() => {
          this.setData({
            gradeData: {
              experNum: experNumData,
              upgrade: false,
              showLevelAlert: false
            }
          })
        }, 1500)
      })
    })
  },
  //
  // 训练/打卡
  pratice() {
    wx.switchTab({
      url: '/pages/practice/practice',
    })
  },
  // 邀请
  invite() {
    increaseExp({
      task_type: 'task_invite'
    }).then(res => {
      this.getUserSingerInfo()
    })
  },
  // 获取个人信息
  getUserInfo() {
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    })
  },
  // 获取任务列表
  getTaskList() {
    getTaskList().then(res => {
      for (let i in res) {
        let str = res[i].DescExperience.split(" ")
        for (let j in str) {
          j = Number(j)
          if (j === 0) {
            res[i].textData1 = str[j]
          } else if (j === 1) {
            res[i].textData2 = str[j]
          } else {
            if (res[i].textData3) {
              res[i].textData3 += str[j]
            } else {
              res[i].textData3 = str[j]
            }
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
    wx.navigateTo({
      url: '/mine/mineOrder/mineOrder',
    })
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

    checkAuth({
      listenable: true,
      ignoreFocusLogin: true
    }).then(() => {
      this.getUserInfo()
      this.getSignData()
      this.needUpdateUserInfo()
    })

    this.getTaskList()
    this.getUserSingerInfo()

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
    let data = getLocalStorage(GLOBAL_KEY.userId)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '测试标题',
      path: `/pages/auth/auth?invite_user_id=${data}`
    }
  }
})