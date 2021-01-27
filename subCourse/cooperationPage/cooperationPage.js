// subCourse/cooperationPage/cooperation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [{
      url: 'https://pic1.zhimg.com/v2-5b5a2fa02cb65f2ab1910439fec5791f_l.jpg'
    }, {
      url: 'https://pic1.zhimg.com/v2-5b5a2fa02cb65f2ab1910439fec5791f_l.jpg'
    }], //banner图列表
    currentBannerIndex: 0, //banner下标
    logoStyle: 0, //logo样式，0代表横版，1代表竖版
  },

  // 判断logo是横版还是竖版
  checkLogoStyle(image) {
    wx.downloadFile({
      url: image,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: (res1) => {
              this.setData({
                logoStyle: res1.width > res1.height ? 0 : 1
              })
            }
          })
        }
      }
    })
  },

  // 切换banner下标
  changeCurrentBannerIndex(e) {
    this.setData({
      currentBannerIndex: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      packageId = ''
    } = options
    if (packageId === '') {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
      return
    }
    console.log('packageId=' + packageId)
    this.checkLogoStyle('https://pic1.zhimg.com/v2-5b5a2fa02cb65f2ab1910439fec5791f_l.jpg')
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