// pages/auth/auth.js
import { wxGetUserInfoPromise } from '../../utils/auth.js'
import { GLOBAL_KEY } from '../../lib/config.js'
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  getUserInfo() {
    try {
      wxGetUserInfoPromise().then(response => {
        console.log(response)
        wx.setStorageSync(GLOBAL_KEY.userInfo, response)
      })
    } catch(error) {
      console.log('用户取消微信授权')
    }

  },
  getPhoneNumber(e) {
   if (e.detail.errMsg.includes('ok')) {
     console.log(e.detail)
     // TODO 将加密数据传递给后台
   } else {
     console.log('用户取消手机号授权')
   }
  }
})
