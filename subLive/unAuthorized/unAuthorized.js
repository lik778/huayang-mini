// subLive/unAuthorized/unAuthorized.js
Page({

  /**
   * Page initial data
   */
  data: {
    equityList: [
      {
        pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412187mTUlyw.jpg',
        name: '花样百姓\n入学资格',
      },
      {
        pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412211utplVQ.jpg',
        name: '专属活动\n线下派对',
      },
      {
        pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412231IlmZFY.jpg',
        name: '会员专享\n严选商城',
      }
    ]
  },
  joinVip() {
    wx.navigateTo({
      url: '/mine/joinVip/joinVip?from=unAuthorized'
    })
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

  }
})
