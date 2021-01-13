import {
  getVideoCourseList,
  getVideoPracticeData
} from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"
import {
  getNowDateAll
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    limit: 10,
    offset: 0,
    noMore: false,
    recommendList: [],
    recommendLimit: 10,
    recommendOffset: 0,
    noMoreRecommend: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.main()
    // 页面pv打点
    bxPoint("mine_ click_course", {
      from_uid: getApp().globalData.super_user_id
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
    if (!this.data.noMore && !this.data.noMoreRecommend) {
      this.main()
    }
  },

  more() {
    wx.reLaunch({
      url: "/pages/discovery/discovery"
    })
  },
  // 跳转到课程详情
  viewCourseDetail(e) {
    let item = e.currentTarget.dataset.item
    // 点击继续学习打点
    bxPoint("mine_course_Learn", {
      series_id: item.kecheng_series.id,
      kecheng_learn_date: getNowDateAll(),
      kecheng_name: item.kecheng_series.teacher_desc,
      kecheng_subname: item.kecheng_series.name,
      kecheng_teacher: item.teacher.name,
    }, false)

    wx.navigateTo({
      url: `/subCourse/videoCourse/videoCourse?videoId=${item.kecheng_series.id}`,
    })
  },
  main() {
    getVideoPracticeData({
      offset: this.data.offset,
      limit: this.data.limit
    }).then((list) => {
      list = list || []
      if (list.length !== this.data.limit) {
        this.setData({
          noMore: true
        })
      }

      let oldOffset = this.data.offset
      let oldList = this.data.courseList
      // list = list.map(t => t.kecheng_series)

      this.setData({
        courseList: [...oldList, ...list],
        offset: oldOffset + list.length
      })
      // this.setData({courseList: [], offset: 0})

      if (this.data.courseList.length === 0) {
        getVideoCourseList({
          offset: this.data.recommendOffset,
          limit: this.data.recommendLimit,
          status: 1
        }).then((recommendList) => {

          if (recommendList.length !== this.data.recommendLimit) {
            this.setData({
              noMoreRecommend: true
            })
          }

          let oldRecommendOffset = this.data.recommendOffset
          let oldRecommendList = this.data.recommendList
          this.setData({
            recommendList: [...oldRecommendList, ...recommendList],
            recommendOffset: oldRecommendOffset + recommendList.length
          })
        })
      }
    })
  }
})