// subLive/coueseList/coueseList.js
import {
  getCourseList,
  getCourseTypeList,
  getWatchLiveNum,
  getWatchLiveAuth,
  subscription,
  uploadFormId,
  getSubscriptionStatus
} from "../../api/live/course"
import {
  getPhoneNumber
} from "../../api/auth/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage,
  getSchedule
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customParams: {},
    active: 0,
    categoryList: [],
    courseList: [],
    limit: 10,
    totalCount: 0,
    offset: 0,
    showBindPhoneButton: true,
    liveIdArr: []
  },
  // formID
  formSubmit(e) {
    let formId = e.detail.formId;
    uploadFormId({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      form_id: formId
    }).then(res => {
      this.getWxAuth()
    })
  },
  // 获取用户小程序授权
  getWxAuth() {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        wx.requestSubscribeMessage({
          tmplIds: ['kNzTTum944inyyV_NFXkjiR7ZtGr8E1FNUadYJQPu1c'],
          success(res1) {
            console.log(res1, 111)
          },
          fail(err) {
            console.log(err, 111)
          }
        })
      }
    })
  },
  // 订阅课程
  sendSubscription(e) {
    let params = {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      target_user_id: e
    }
    subscription(params).then(() => {
      wx.showToast({
        title: '订阅成功！',
      })
    })
  },
  // 获取订阅信息
  getStatus() {
    let openId = getLocalStorage(GLOBAL_KEY.openId)
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    getSubscriptionStatus(`?open_id=${openId}&user_id=${userId}`).then(res => {
      // console.log(res)
    })
  },
  //跳转去直播间
  toLive(e) {
    let roomId = e.currentTarget.dataset.item //直播间号
    // 判断是否是会员/是否入学
    this.checkIdentity(roomId)
  },
  // 判断是否是会员/是否入学
  checkIdentity(roomId) {
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    if (userId === undefined) {
      return;
    } else {
      // 已授权获取权限
      let params = {
        room_id: roomId,
        user_id: userId
      }
      // 获取直播权限
      getWatchLiveAuth(params).then(res => {
        // console.log(res)
        if (res === "vip") {
          // 不是会员,跳往注册会员页
          // wx.navigateTo({
          //   url: 'url',
          // })
          wx.showToast({
            title: '跳往注册会员页',
          })
        } else if (res === "daxue") {
          // 未加入花样大学,跳往入学申请页
          // wx.navigateTo({
          //   url: 'url',
          // })
          wx.showToast({
            title: '跳往入学申请页',
          })
        } else {
          let openId = getLocalStorage(GLOBAL_KEY.openId)
          let paramsData = {
            zhibo_room_id: roomId,
            open_id: openId
          }
          //统计观看人数
          getWatchLiveNum(paramsData).then(() => {
            // 跳往前去直播间
            wx.navigateTo({
              url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(this.data.customParams))}`
            })
          })
        }
      })
    }
  },
  // 获取手机号
  getPhoneNumberData(e) {
    getPhoneNumber(e).then(res => {
      this.setData({
        showBindPhoneButton: res === 1 ? true : false
      })
    })
  },
  // 切换分类
  onChange(e) {
    let id = ""
    for (let i in this.data.categoryList) {
      if (this.data.categoryList[i].name === e.detail.title) {
        id = this.data.categoryList[i].id
      }
    }
    this.getList(id)
  },
  // 获取课程列表
  getList(params) {
    getCourseList(`?limit=${this.data.limit}&offset=${this.data.offset}&category_id=${params}`).then(list => {
      let liveArr = []
      for (let i in list.list) {
        if (list.list[i].kecheng.kecheng_type === 0) {
          liveArr.push(list.list[i].zhibo_room.id)
        }
      }
      this.setData({
        liveIdArr: liveArr,
        courseList: list.list || [],
        totalCount: list.count
      })
      this.getStatusData(liveArr)
      setTimeout(()=>{
        this.getStatusData(liveArr)
      },1000*60)
    })
  },
  // 获取直播状态
  getStatusData(liveArr) {
    let courseList = this.data.courseList.concat([])
    getSchedule(liveArr).then(res => {
      console.log(res,111)
      for (let i in res) {
        for (let j in courseList) {
          if (res[i].roomId === courseList[j].zhibo_room.id) {
            courseList[j].zhibo_room.getStatus = res[i].liveStatus
          }
        }
      }
      this.setData({
        courseList: courseList
      })
      console.log(this.data.courseList)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户授权状态
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    if (userId === undefined) {
      this.setData({
        showBindPhoneButton: true
      })
    } else {
      this.setData({
        showBindPhoneButton: false
      })
    }
    // 获取分类列表
    getCourseTypeList().then(res => {
      this.setData({
        categoryList: res
      })
      this.getList(res[0].id)
    })
    // 获取订阅状态
    this.getStatus()
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
  onShareAppMessage: function () {

  }
})