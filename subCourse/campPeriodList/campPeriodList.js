// subCourse/campPeriodList/campPeriodList.js
import {
  getCampDetail
} from "../../api/course/index"
import {
  convertToChinaNum
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campData: "",
    campId: "",
    courseList: "",
    periodList: []
  },

  // 返回训练营详情
  backCampDetail() {
    wx.navigateBack()
  },

  // 选中某一天日期
  toDetail(e) {
    let index = e.currentTarget.dataset.item
    let pageLength = getCurrentPages()
    if (pageLength.length > 8) {
      wx.redirectTo({
        url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&dayNum=${index}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&dayNum=${index}`,
      })
    }
  },

  // 获取训练营数据
  getCampDetailData(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      this.setData({
        campData: res
      })
      this.getManyCamoData(res.period)
    })
  },

  // 获取多个训练营数据
  getManyCamoData(period) {
    let result = this.getAllNum(0, period);
    this.setData({
      periodList: result
    })
  },

  // 取某个区间内的所有正整数(0-8含8)
  getAllNum(min, max) {
    let chinaNum = []
    let num1 = []
    for (let i = min; i < max + 1; i++) {
      let a = convertToChinaNum(i)
      num1.push(i)
      chinaNum.push(a)
    }
    return {
      chinaNum,
      num1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      campId
    } = options
    this.setData({
      campId
    })
    this.getCampDetailData(campId)
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