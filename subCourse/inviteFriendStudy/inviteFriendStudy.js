// subCourse/inviteFriendStudy/inviteFriendStudy.js
import {
  getInviteFriendInfo,
  receiveCreate,
  checkReceiveCreate
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInviter: true,
    inviteInfo: "",
    inviteId: "",
    userId: '',
    didShowAuth: false,
    hasRecieve: false,
    canShow: false,
    width: "",
    height: ""
  },

  // 保存到相册
  saveToAblum() {
    console.log("保存到相册")
  },

  // 立即领取
  get() {
    if (this.data.userId === '') {
      this.setData({
        didShowAuth: true
      })
      return
    }
    receiveCreate({
      gift_id: this.data.inviteId,
      user_id: this.data.userId
    }).then(res => {
      if (res.code === 0) {
        this.getInviteData()
      }
    })
  },

  // 获取邀请信息
  getInviteData() {
    getInviteFriendInfo({
      gift_id: this.data.inviteId
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          inviteInfo: res.data
        })
        checkReceiveCreate({
          gift_id: this.data.inviteId,
          user_id: this.data.userId
        }).then(res1 => {
          if (res1.code === 0) {
            if (res1.data) {
              wx.navigateTo({
                url: `/subCourse/videoCourse/videoCourse?videoId=${res.data.gift.kecheng_series_id}`,
              })
            } else {
              this.setData({
                canShow: true
              })
            }
          }
        })
      }
    })
  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 同意授权
  authCompleteEvent() {
    this.setData({
      userId: getLocalStorage(GLOBAL_KEY.userId)
    })
    this.getInviteData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inviteId = Number(options.inviteId)
    if (options.isInviter) {
      this.setData({
        isInviter: false
      })
    }
    let width = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
    let height = ((width - 60) / 7 * 11).toFixed(2)
    this.setData({
      inviteId,
      width: width,
      height: height,
      userId: getLocalStorage(GLOBAL_KEY.userId) || ''
    })
    this.getInviteData(inviteId)
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