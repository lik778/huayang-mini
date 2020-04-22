// mine/invite/invite.js
import { createCanvas } from "./canvas"
import { getInviteCode, getVipNum } from "../../api/mine/index"
import { getSubscriptionStatus, subscription } from "../../api/live/course"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY, SubscriptType } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcCode: "",
    canvasUrl: "",
    posturl: "",
    userInfo: {},
    statusHeight: 0,
    num: 0, //会员编号
    posterWidth: 0, //海报宽度
    posterHeigt: 0, //海报高度
    radio: 0, //海报缩放比
    showDialog: false,
    status: false //订阅状态
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
          this.setData({
            posterWidth: (info.height - 311) / 1.33,
            posterHeigt: info.height - 311,
            radio: (info.height - 311) / 356
          })
        } else {
          this.setData({
            posterWidth: info.width - 32,
            posterHeigt: info.width * 1.33,
            radio: (info.width - 32) / 267
          })
        }
        console.log(this.data.radio)
      },
    })
  },
  // getImgUrl
  getImgUrl() {
    let arr = ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1587002742wEdydN.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1587002775RSdvpH.jpg"];
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
    // 绘制canvas
    createCanvas({
      bgUrl: this.data.posturl,
      nickname: this.data.userInfo.nickname,
      num: this.data.num,
      headicon: this.data.userInfo.avatar_url,
      qcCode: this.data.qcCode
    }).then(url => {
      console.log(url, 9000)
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success(res) {
          if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
            if (!_this.data.status) {
              _this.setData({
                showDialog: true
              })
            } else {
              wx.showToast({
                title: '保存成功',
                duration:2000
              })
            }
            wx.hideLoading()
          } else {
            wx.showToast({
              title: '保存失败',
              icon: "none",
              duration: 3000
            })
          }
        },
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
      path: `/mine/joinVip/joinVip?scene=${getLocalStorage(GLOBAL_KEY.userId)}`,
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
