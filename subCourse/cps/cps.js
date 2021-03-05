import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  douyinWxPay
} from "../../api/cps/index"
// subCourse/cps/cps.js
import {
  payCourse,
  hasUserInfo,
  hasAccountInfo,
  getLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAuth: false,
    userInfo: '',
    orderId: '',
    cpsData: ''
  },

  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
    wx.reLaunch({
      url: `/subCourse/noAuthWebview/noAuthWebview?link=${this.data.cpsData.url}&login=''&pay=0`,
    })
  },

  authCompleteEvent() {
    setTimeout(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      this.setData({
        didShowAuth: false,
        userInfo
      })
      this.pay()
    }, 200)
  },
  // 支付
  pay() {
    douyinWxPay({
      cps_id: this.data.cpsData.id,
      mobile: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile,
      from: this.data.cpsData.from,
      mode: this.data.cpsData.mode,
    }).then(res => {
      payCourse({
        id: res.data.id,
        name: '抖音视频包'
      }).then(res1 => {
        if (res1.errMsg === 'requestPayment:ok') {
          wx.navigateTo({
            url: `/subCourse/noAuthWebview/noAuthWebview?link=${this.data.cpsData.url}&login=true&pay=1`,
          })
        } else {
          let data = hasAccountInfo() ? true : ''
          wx.reLaunch({
            url: `/subCourse/noAuthWebview/noAuthWebview?link=${this.data.cpsData.url}${encodeURIComponent(`${data}&pay=0`)}`,
          })
        }
      }).catch(() => {
        let data = hasAccountInfo() ? true : ''
        wx.reLaunch({
          url: `/subCourse/noAuthWebview/noAuthWebview?link=${this.data.cpsData.url}${encodeURIComponent(`${data}&pay=0`)}`,
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = JSON.parse(options.params)
    if (options.id) {
      if (hasAccountInfo() && hasUserInfo()) {
        this.setData({
          userInfo: getLocalStorage(GLOBAL_KEY.accountInfo),
          orderId: options.id,
          cpsData: options
        })
        this.pay()
      } else {
        this.setData({
          didShowAuth: true,
          orderId: options.id,
          cpsData: options
        })
      }
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }

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
})