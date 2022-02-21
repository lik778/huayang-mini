import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    bxPoint("university_ page", {})
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
    return {
      title: "花样老年大学，为银发新青年打造社交体验式学习新场景",
      path: "/statics/hySchool/hySchool",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1645149928wadXmv.jpg"
    }
  },
  // 查看更多师资
  goToTeacherTeam() {
    bxPoint("university_teacher_more_click", {}, false)
    wx.navigateTo({url: "/statics/teacherTeam/teacherTeam"})
  }
})
