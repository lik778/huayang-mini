import { exitBootCamp, exitCourse, queryUserJoinedBootCamp, queryUserJoinedClasses } from "../../api/course/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userJoinedBootCamp: [],
    userJoinedClassesList: [],
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
    this.initial()
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
  quitCourse(e) {
    wx.showModal({
      title: '提示',
      content: '是否从我的练习中删除该练习',
      success: (res) => {
        if (res.confirm) {
          exitCourse({kecheng_id: e.currentTarget.dataset.index}).then(() => {
            this.initial()
          })
        }
      }
    })
  },
  quitBootCamp(e) {
    wx.showModal({
      title: '提示',
      content: '是否从我的练习中删除该练习',
      success: (res) => {
        if (res.confirm) {
          exitBootCamp({traincamp_id: e.currentTarget.dataset.index}).then(() => {
            this.initial()
          })
        }
      }
    })
  },
  initial() {
    queryUserJoinedClasses().then((userJoinedClassesList) => {
      this.setData({userJoinedClassesList})
    })

    queryUserJoinedBootCamp().then((userJoinedBootCamp) => {
      this.setData({userJoinedBootCamp})
    })
  }
})
