import {
  $notNull,
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo
} from "../../utils/util"
import request from "../../lib/request"
import {
  GLOBAL_KEY,
  ROOT_URL
} from "../../lib/config";
import {
  getChannelLives,
  getCurrentTimeChannelLiveInfo,
  getHistorySubscribeLives,
  subscribeMiniProgramMessage,
  getUserAttentionOfficeAccount
} from "../../api/channel/index"
import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false, // 展示页面
    LongSubscribeTempId: "Yak_FhmnmqkJIjVW1T-bSi3Sz6VC2-YOXAm-2YEmjpU", // 长期订阅
    ShortSubscribeTempId: "6gL6L2QXs5r25jUnv_4ZET_0_iUi7GIah2EEr7TA3Zs", // 一次行订阅
    didShowOfficialAccountComponent: false, // 是否展示公众号关注组件
    didSubscribeAllChannelLives: false, // 是否预约所有视频号直播
    reviewChannelList: [], // 往期回看直播数据
    subscribeChannelList: [], // 预约直播数据
    channelLiveId: "sphkeu2SwOQKZB7", // 花样百姓
    liveInfo: null,
    noticeInfo: {},
    eventId: 0,
    didShowAuth: false,
    hasOtherPlatformLive: false,
    hasSubscribeStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    bxPoint("live_notice_page_pv", {})
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
    return {
      title: "花样直播，成就向往的生活，成为更好的自己～",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1649227120luQbeC.jpg",
      path: "/pages/channelLive/channelLive"
    }
  },

  hasSubscribe() {
    let openId = getLocalStorage(GLOBAL_KEY.openId)
    if (!openId) return false
    getUserAttentionOfficeAccount({
      open_id: openId
    }).then(res => {
      this.setData({
        hasSubscribeStatus: res.data
      })
    })
  },

  run() {
    this.getChannelLiveInfo()
    this.hasSubscribe()
    // 检查用户是否已一键订阅所有直播预约
    this.subScribeMessage(this.data.LongSubscribeTempId)
    // 往期回放
    getChannelLives({
      status: 3,
      is_show: 1
    }).then((data) => {
      this.setData({
        reviewChannelList: data
      })
    })
    // 即将开播
    getChannelLives({
      status: 1,
      is_show: 1
    }).then((data) => {
      data = data.map(n => ({
        ...n,
        sub: false
      }))
      let list = data.filter(res => {
        return res.source === 7
      })
      this.setData({
        subscribeChannelList: data,
        hasOtherPlatformLive: list.length > 0 ? true : false
      })
      this.loadHistorySubscribeChannelLives()
    })
  },
  // 预约直播
  reserveLive() {
    wx.reserveChannelsLive({
      noticeId: this.data.noticeInfo.noticeId
    })
  },
  // 打开视频号直播
  openLive() {
    if (!$notNull(this.data.liveInfo)) return
    wx.openChannelsLive({
      finderUserName: this.data.channelLiveId,
      feedId: this.data.liveInfo.feedId,
      nonceId: this.data.liveInfo.nonceId,
      success() {
        console.log("打开视频号直播成功")
      },
      fail(err) {
        console.log(err)
      },
      complete() {
        bxPoint("live_notice_page_living", {
          live_notice_title: this.data.liveInfo.description
        }, false)
      }
    })
  },
  // 打开视频号视频
  openChannelVideo() {
    wx.openChannelsActivity({
      finderUserName: this.data.channelLiveId,
      feedId: "",
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
        if ($notNull(res) && res.status === 2) {
          getCurrentTimeChannelLiveInfo().then((data) => {
            res.headUrl = data.cover || "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1640248293FUtNcA.jpg"
            self.setData({
              liveInfo: res
            })
          }).catch(() => {
            self.setData({
              liveInfo: res
            })
          })
        }
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
        self.setData({
          noticeInfo: res
        })
      },
      fail(err) {
        // console.log(err)
      }
    })
  },
  // 加载历史已订阅视频号直播列表
  loadHistorySubscribeChannelLives() {
    if (this.data.didSubscribeAllChannelLives) return false
    let openId = getLocalStorage(GLOBAL_KEY.openId)
    if (!openId) return false
    getHistorySubscribeLives({
        open_id: openId
      })
      .then((data) => {
        let oldData = data || []
        let oldList = this.data.subscribeChannelList.slice()
        oldData.forEach(subscribeId => {
          let target = oldList.find(item => item.id === subscribeId)
          if (target) {
            target.sub = $notNull(target)
          }
        })
        this.setData({
          subscribeChannelList: oldList
        })
      })
  },
  openImagePreview(e) {
    if (!hasUserInfo()) {
      this.setData({
        didShowAuth: true
      })
      return
    }


    let {
      index = '', item = ''
    } = e.currentTarget.dataset

    if (item.sub) return

    let params = {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      status: this.data.hasSubscribeStatus ? index : 0,
    }
    if (item.id) {
      params['zhibo_id'] = item.id
    }
    subscribeMiniProgramMessage(params)

    if (this.data.hasSubscribeStatus) {
      wx.showToast({
        title: '订阅成功',
      })

      let oldList = this.data.subscribeChannelList.slice()
      let target = oldList.find(res => res.id === item.id)
      if (target) {
        target.sub = $notNull(target)
      }
      console.log(oldList)
      this.setData({
        subscribeChannelList: oldList
      })
      return
    }


    let src = ROOT_URL.dev === request.baseUrl ? "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1650864612mlePwC.jpg" : "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1650864568Zzirwb.jpg"
    wx.previewImage({
      urls: [src]
    })
  },
  onSubscribeTap(e) {

    if (!hasUserInfo()) return this.setData({
      didShowAuth: true
    })

    // 订阅过长期通知
    if (this.data.didSubscribeAllChannelLives && !this.data.hasOtherPlatformLive) return false
    let {
      index,
      item: {
        id,
        sub,
        title,
        source
      } = {}
    } = e.currentTarget.dataset
    // 订阅过一次性通知
    if (sub) return false
    let tempId = ""
    let self = this
    switch (+index) {
      case 1: {
        // 长期订阅
        tempId = this.data.LongSubscribeTempId
        bxPoint("live_notice_page_subscribe", {}, false)
        break;
      }
      case 2: {
        // 一次性订阅
        tempId = this.data.ShortSubscribeTempId
        bxPoint("live_notice_page_remind", {
          live_notice_id: id,
          live_notice_title: title
        }, false)
        break;
      }
    }

    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting[tempId] === "reject") {
          wx.showModal({
            title: '订阅消息',
            content: '订阅花样百姓消息，不错过精彩直播视频，务必设置订阅消息为允许哦',
            confirmText: '立即订阅',
            confirmColor: '#33c71b',
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else if (res.subscriptionsSetting[tempId] === "accept") {
          console.log("该用户已订阅消息");
        } else {
          wx.requestSubscribeMessage({
            tmplIds: [tempId],
            success(response) {
              if (response.errMsg === "requestSubscribeMessage:ok" && response[tempId] === "accept") {
                console.log(index)
                let params = {
                  open_id: getLocalStorage(GLOBAL_KEY.openId),
                  status: index,
                }
                if (id) {
                  params['zhibo_id'] = id
                  wx.nextTick(() => {
                    let oldList = self.data.subscribeChannelList.slice()
                    let target = oldList.find(item => item.id === id)
                    if (target) {
                      target.sub = $notNull(target)
                    }
                    self.setData({
                      subscribeChannelList: oldList
                    })

                  })
                }
                subscribeMiniProgramMessage(params).then(() => {
                  if (tempId === self.data.LongSubscribeTempId) {
                    self.subScribeMessage(tempId)
                  }
                })
              } else if (response[tempId] === "reject") {
                // 用户拒绝授权，则三天之内不再显示
                console.error("用户拒绝授权");
              }
            }
          })
        }
      }
    })
  },
  // 检查通知订阅状态
  subScribeMessage(tempId) {
    let self = this
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        if (res.subscriptionsSetting[tempId] === "accept") {
          self.setData({
            didSubscribeAllChannelLives: true
          })
        } else if (res.subscriptionsSetting[tempId] === "reject") {
          self.setData({
            didSubscribeAllChannelLives: false
          })
        }
      },
      complete() {
        self.setData({
          showPage: true
        })
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
  officialLoad(e) {
    this.setData({
      didShowOfficialAccountComponent: true
    })
    bxPoint("subsciptions_view", {}, false)
    // console.log(e, "officialLoad");
  },
  officialError(e) {
    this.setData({
      didShowOfficialAccountComponent: false
    })
    // console.log(e, "officialError");
  },
  onReview(e) {
    if (!hasAccountInfo()) return this.setData({
      didShowAuth: true
    })
    let {
      video_url,
      id,
      title,
      cover
    } = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/channelReview/channelReview?link=${video_url}&title=${title}&id=${id}&cover=${cover}`,
      success() {
        bxPoint("live_notice_page_replay", {
          live_replay_id: id,
          live_replay_title: title
        }, false)
      }
    })
  },
  onContactLogoTap() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'
      },
      corpId: 'ww8d4cae43fb34dc92'
    })
  },
})