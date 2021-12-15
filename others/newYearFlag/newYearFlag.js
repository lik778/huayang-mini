Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyFlagAnimate: {},
    timer: null,
    historyFlags: [
      "2022年，吉祥如意要学习走秀，瘦身10斤",
      "2022年，玲要学会跳一支民族舞，争取加入花样艺术团",
      "2022年，芳芳要每周跑步三次，每次五公里",
      "2022年，平安是福要每周读一本书",
      "2022年，彩云要参加花样模特大赛拿名次",
    ]
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
    clearInterval(this.data.timer)
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
    let t = setTimeout(() => {
      this.createHistoryFlagsAnimate()
      clearTimeout(t)
    }, 1000)
  },

  // flags展示动画
  createHistoryFlagsAnimate() {
    let animateCls = wx.createAnimation({
      duration: 60 * 10,
      timingFunction: "linear",
    })

    return false

    let cur = 1
    let timer = setInterval(() => {
      if (cur > this.data.historyFlags.length - 4) {
        // TODO 加载更多数据
        let od = this.data.historyFlags.slice()
        this.setData({historyFlags: [...od, ...od]})
      }
      animateCls.translateY(-18 * cur).step()
      cur++
      this.setData({historyFlagAnimate: animateCls.export()})
    }, 3 * 1000)
    this.setData({timer})
  }
})
