// pages/userCenter/userCenter.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getTaskList,
  taskCheckIn,
  getSignData,
  needUpdateUserInfo,
  increaseExp
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
    taskList: [],
    processStyle: "width:30%;",
    hasCheckIn: false,
    showMessage: false
  },
  // 获取用户信息
  getUserSingerInfo() {
    getUserInfo('scene=zhide').then(res => {
      setLocalStorage(GLOBAL_KEY.accountInfo, res)
      this.setData({
        userInfo: res
      })
    })
  },
  // 判断是否需要填写用户资料
  needUpdateUserInfo() {
    needUpdateUserInfo({
      user_id: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).id
    }).then(res => {
      if (res) {
        this.setData({
          showMessage: res
        })
      }
    })
  },
  // 完善个人资料
  fullSelfMsg() {
    console.log("完善个人资料")
  },
  // 获取签到信息
  getSignData() {
    getSignData({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      time: Math.round(new Date() / 1000),
      scene: "zhide_center"
    }).then(res => {
      if (res.id) {
        this.setData({
          hasCheckIn: true
        })
      }
    })
  },
  // 签到
  checkin() {
    taskCheckIn({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      scene: 'zhide_center'
    }).then(res => {
      wx.showToast({
        title: '签到成功',
        icon: "success"
      })
      this.setData({
        hasCheckIn: true
      })
      increaseExp({
        task_type: 'task_checkin'
      }).then(res => {
        this.getUserSingerInfo()
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
      // console.log(res)
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
    console.log(111)
    checkAuth({
      listenable: true,
      ignoreFocusLogin: true
    }).then(() => {
      this.getUserInfo()
      this.getSignData()
      this.needUpdateUserInfo()
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '测试标题',
      path: '/page/userCenter/userCenter?id=123'
    }
  }
})