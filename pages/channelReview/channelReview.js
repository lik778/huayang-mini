import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    title: "",
    cover: "",
    id: "",
    totalDuration: "",
    lastPlaySecondTime: '',
    totalVisitDuration: 0,
    needRecordDuration: true,
    loading: true,
    didRedirect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      link = '', title = '', cover = '', didRedirect, id = ''
    } = options
    if (link) {
      this.setData({
        link,
        title,
        cover,
        id,
        didRedirect: didRedirect === "yes"
      })
    }

    wx.showLoading({
      title: '加载中'
    })
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
    this.setData({
      totalVisitDuration:0
    })
  },

  videoPlayTimeUpdate(e) {
    let time = parseInt(e.detail.currentTime)
    if (time !== this.data.lastPlaySecondTime) {
      this.setData({
        lastPlaySecondTime: time,
        totalVisitDuration: this.data.totalVisitDuration + 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 2022.4.8-JJ
    bxPoint("live_replay_duration", {
      live_replay_id: this.data.id,
      live_replay_title: this.data.title,
      total_duration: this.data.totalDuration,
      total_visit_duration: this.data.totalVisitDuration,
    }, false)
    this.setData({
      needRecordDuration: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.needRecordDuration) {
      // 2022.4.8-JJ
      bxPoint("live_replay_duration", {
        live_replay_id: this.data.id,
        live_replay_title: this.data.title,
        total_duration: this.data.totalDuration,
        total_visit_duration: this.data.totalVisitDuration,
      }, false)
    }
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
      title: this.data.title,
      imageUrl: this.data.cover,
      path: `/pages/channelReview/channelReview?link=${this.data.link}&didRedirect=yes`
    }
  },
  onLoadMetaDataDone(e) {
    this.setData({
      loading: false,
      totalDuration: parseInt(e.detail.duration)
    })
    wx.hideLoading()
  }
})