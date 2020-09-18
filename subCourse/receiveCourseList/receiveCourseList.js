import { queryFissionList } from "../../api/course/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
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
    this.queryList()
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
  // 跳转至对应课程
  jumpToCourseDetail(e) {
    let {id} = e.currentTarget.dataset.item

    wx.redirectTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${id}`,
    })
  },
  queryList() {
    queryFissionList({limit: 100}).then((list) => {
      let handledList = list.filter((res) => {
        if (res.discount_price === -1 && res.price > 0) {
          // 原价出售
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.price * res.invite_discount / 10000).toFixed(2)
          }
        } else if (res.discount_price > 0 && res.price > 0) {
          // 收费但有折扣
          // 是否有营销活动
          if (+res.invite_open === 1) {
            res.fission_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
          }
        }

        // 只显示开启营销活动的数据
        if (+res.invite_open === 1) {
          return res
        }
      })
      this.setData({list: handledList})
    })
  }
})
