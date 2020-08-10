import { exitBootCamp, exitCourse, queryUserJoinedBootCamp, queryUserJoinedClasses } from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"

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
    bxPoint("parctice_manage", {from_uid: options.invite_user_id})
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
  quitCourse(e) {
    bxPoint("parctice_give_up", {course_type: "kecheng", course_id: e.currentTarget.dataset.index}, false)
    wx.showModal({
      title: '提示',
      content: '是否从我的练习中删除该练习',
      confirmText: "删除",
      cancelText: "再想想",
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
    bxPoint("parctice_give_up", {course_type: "bootcamp", course_id: e.currentTarget.dataset.index}, false)
    wx.showModal({
      title: '提示',
      content: '是否从我的练习中删除该练习',
      confirmText: "删除",
      cancelText: "再想想",
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
