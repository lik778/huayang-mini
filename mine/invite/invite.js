// mine/invite/invite.js
import {
  createCanvas
} from "./canvas"
import {
  getInviteCode,
  getVipNum,
  getActivityTime
} from "../../api/mine/index"
import {
  getSubscriptionStatus,
  subscription
} from "../../api/live/course"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY,
  SubscriptType
} from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcCode: "",
    posturl: "",
    userInfo: {},
    statusHeight: 0,
    num: 0, //会员编号
    posterWidth: 0, //海报宽度
    posterHeigt: 0, //海报高度
    radio: 0, //海报缩放比
    showDialog: false,
    status: false, //订阅状态
    bannerSrc: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1587884129ygbRvw.jpg",
    // noteText:"活动截止日期：2020年1月1日 23:59:59",
    noteText: "",
    canvasBgUrl: ""
  },
  // 订阅
  show() {
    this.order()
  },
  show1() {
    if (!this.data.status) {
      setTimeout(() => {
        this.setData({
          showDialog: true
        })
      }, 1500)
    }

  },
  // 订阅封装
  order() {
    wx.requestSubscribeMessage({
      tmplIds: [SubscriptType.inivteMessage],
      success(res) {
        if (res[SubscriptType.inivteMessage] === 'accept') {
          subscription({
            open_id: getLocalStorage(GLOBAL_KEY.openId),
            user_id: getLocalStorage(GLOBAL_KEY.userId),
            sub_key: "invite"
          }).then(() => {
            wx.showToast({
              title: '订阅成功',
            })
          })
        }
      },
      fail(err) {
        console.log(err, 'requestSubscribeMessage error callback')
      }
    })
  },
  // 计算宽高,自适应海报
  calculate() {
    wx.getSystemInfo({
      complete: (res) => {
        let info = {
          width: res.screenWidth,
          height: res.screenHeight
        }
        if ((info.height - 311) / 1.33 < info.width - 32) {
          // 长屏
          this.setData({
            posterWidth: (info.height - 311) / 1.33,
            posterHeigt: info.height - 311,
            radio: (info.height - 311) / 356,
            bannerSrc: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1588149332gxwlOK.jpg"
          })
        } else {
          // 短屏
          this.setData({
            posterWidth: info.width - 32,
            posterHeigt: info.width * 1.33,
            radio: (info.width - 32) / 267,
            // bannerSrc: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1587884183ZLKsxQ.jpg",
            bannerSrc:"https://huayang-img.oss-cn-shanghai.aliyuncs.com/1588149332gxwlOK.jpg"
          })
        }
        console.log(this.data.radio)
      },
    })
  },
  // getImgUrl
  getImgUrl() {
    let arr = ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1588225875dHdZPH.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1588225906sguvUa.jpg"];
    let index = Math.floor((Math.random() * arr.length))
    this.setData({
      posturl: arr[index]
    })
  },
  // 获取用户信息
  getUserInfo() {
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
    })
  },
  // 获取小程序邀请码
  inviteCode() {
    getInviteCode(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}&size=64*64`).then(res => {
      this.setData({
        qcCode: res
      })
    })
  },
  // 保存到相册
  saveAlbum() {
    let _this = this
    wx.showLoading({
      title: "加载中",
    })
    if (this.data.canvasBgUrl == '') {
      this.beginDraw().then(() => {
        this.getAblumAuth(_this)
      })
    } else {
      this.getAblumAuth(_this)
    }
  },
  // 获取保存相册授权
  getAblumAuth(_this) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              _this.saveImg({
                url: _this.data.canvasBgUrl,
                _this
              })
            },
            fail: () => {
              wx.showModal({
                title: "请打开相册权限",
                duration: 2000,
                showCancel: false,
                success: (res1) => {
                  console.log(res1)
                  if (res1.confirm) {
                    wx.openSetting({
                      success(res) {
                        console.log(res)
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log("获取授权好了")
          _this.saveImg({
            url: _this.data.canvasBgUrl,
            _this
          })
        }
      }
    })
  },
  // 绘制canvas
  beginDraw() {
    // 绘制canvas
    return new Promise(resolve => {
      createCanvas({
        bgUrl: this.data.posturl,
        nickname: this.data.userInfo.nickname,
        num: this.data.num,
        headicon: this.data.userInfo.avatar_url,
        qcCode: this.data.qcCode,
        noteText: this.data.noteText
      }).then(url => {
        console.log("canvas图片有了")
        this.setData({
          canvasBgUrl: url
        })
        resolve()
      })
    })

  },
  // 保存图片封装
  saveImg({
    url,
    _this
  }) {
    console.log("保存")
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success(res) {
        if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
          if (!_this.data.status) {
            wx.showToast({
              title: '保存成功',
              duration: 3000,
            })
            setTimeout(() => {
              wx.hideLoading()
              _this.setData({
                showDialog: true
              })
            }, 3000)
          } else {
            wx.showToast({
              title: '保存成功',
              duration: 3000,
            })
            setTimeout(() => {
              wx.hideLoading()
            }, 3000)
          }
        } else {
          wx.showToast({
            title: '保存失败',
            icon: "none",
            duration: 3000
          })
        }
      },
    })
  },
  // 获取活动日期文案
  getActivityTimeData() {
    getActivityTime().then(res => {
      this.setData({
        noteText: "活动截止日期：" + res.data
      })
    })
  },
  // 获取订阅状态
  getSubscription() {
    getSubscriptionStatus({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      sub_key: "invite"
    }).then(res => {
      this.setData({
        status: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    this.getUserInfo()
    // 获取设备宽高
    this.calculate()
    // 随机生成背景图
    this.getImgUrl()
    // 获取活动日期文案
    this.getActivityTimeData()
    // 获取小程序二维码
    this.inviteCode()
    // 获取小程序订阅信息
    this.getSubscription()
    // 获取会员编号
    getVipNum(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(({
      data
    }) => {
      this.setData({
        num: data
      })
      this.beginDraw()
    })
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })

    // 禁用右上角原生分享
    wx.hideShareMenu()
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
  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: `${this.data.userInfo.nickname}刚加入花样汇，邀请你一起加入，免费课程看不完`,
      path: `/mine/joinVip/joinVip?scene=${getLocalStorage(GLOBAL_KEY.userId)}&from=invitePoster`,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  }
})
