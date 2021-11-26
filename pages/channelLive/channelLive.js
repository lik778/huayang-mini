import { getLocalStorage, hasUserInfo, setLocalStorage, toast } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";
import { updateSubscribeMessageStatus } from "../../api/auth/index";
import dayjs from "dayjs";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    channelLiveId: "sphSWeL8a8r2E1O", // 花样超模
    liveInfo: {},
    noticeInfo: {},
    eventId: 0,
    didShowAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.run()
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

  },
  run() {
    this.getChannelLiveInfo()
    this.getChannelLiveNotice()
    console.log(getLocalStorage(GLOBAL_KEY.openId));
  },
  // 预约直播
  reserveLive() {
    wx.reserveChannelsLive({noticeId: this.data.noticeInfo.noticeId})
  },
  // 打开视频号直播
  openLive() {
    wx.openChannelsLive({
      finderUserName: this.data.channelLiveId,
      feedId: this.data.liveInfo.feedId,
      nonceId: this.data.liveInfo.nonceId,
      success(res) {
        console.log("打开视频号直播成功", res)
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  // 打开视频号视频
  openChannelVideo() {
    wx.openChannelsActivity({
      finderUserName: this.data.channelLiveId,
      feedId: "export/UzFfAgtgekIEAQAAAAAAJQsut8rTvgAAAAstQy6ubaLX4KHWvLEZgBPEt4MYJ24ID7f9zNPgMJo_ahzkKw7Mn3_wFI6rKJDH",
      success(res) {
        console.log("打开视频号视频成功", res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 打开视频号活动页
  openChannelEvent() {
    wx.openChannelsEvent({
      finderUserName: this.data.channelLiveId,
      eventId: this.data.eventId,
      success(res) {
        console.log("打开视频号活动页成功", res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 获取直播信息
  getChannelLiveInfo() {
    let self = this
    wx.getChannelsLiveInfo({
      finderUserName: this.data.channelLiveId,
      success(res) {
        console.log("直播信息", res)
        self.setData({liveInfo: res})
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 获取直播预约信息
  getChannelLiveNotice() {
    let self = this
    wx.getChannelsLiveNoticeInfo({
      finderUserName: this.data.channelLiveId,
      success(res) {
        console.log("直播预约信息", res)
        self.setData({noticeInfo: res})
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onGuideTap() {
    if (!hasUserInfo()) return this.setData({didShowAuth: true})
    let tempId = "Yak_FhmnmqkJIjVW1T-bSg6oKsdUK5yvi3bU5_ha7i8"
    let self = this
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting[tempId] === "reject") {
          wx.showModal({
            title: '订阅消息',
            content: '订阅花样百姓消息，不错过精彩直播视频。务必设置订阅消息为允许哦',
            confirmText: '立即订阅',
            confirmColor: '#33c71b',
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else if (res.subscriptionsSetting[tempId] === "accept") {
          toast("该用户已订阅消息")
        } else {
          wx.requestSubscribeMessage({
            tmplIds: [tempId],
            success(response) {
              if (response.errMsg === "requestSubscribeMessage:ok" && response[tempId] === "accept") {
                updateSubscribeMessageStatus({
                  app_id: "wx85d130227f745fc5",
                  open_id: getLocalStorage(GLOBAL_KEY.openId),
                  template_id: tempId
                }).then(() => {
                  // 检查开课通知订阅状态
                  self.subScribeMessage()
                })
              } else if (response[tempId] === "reject") {
                // 用户拒绝授权，则三天之内不再显示
                console.error("用户拒绝授权，则三天之内不再显示");
                toast("用户拒绝授权");
              }
            }
          })
        }
      }
    })
  },
  subScribeMessage() {
    let tempId = "Yak_FhmnmqkJIjVW1T-bSg6oKsdUK5yvi3bU5_ha7i8"
    let self = this
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting[tempId] === "accept") {
          self.setData({didAlreadySubscribe: true})
        }
      }
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
    this.setData({
      didShowAuth: false,
    })
  },
  formSubmit(e) {
    let {formId} = e.$wx.detail;
    // 上传formId
    let openid = getLocalStorage(GLOBAL_KEY.openId);
    // this.uploadFormId({open_id: openid, form_id: formId});
  },
})
