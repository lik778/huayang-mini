import { queryUserJoinedBootCamp } from "../../api/course/index"
import { getRecommendBootcampInMine } from "../../api/mine/index"
import dayjs from "dayjs"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campList: [],
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
    wx.switchTab({url: "/pages/discovery/discovery"})
  },
  // 跳转到训练营详情
  joinCamp(e) {
    let { id } = e.currentTarget.dataset.index
    if (id) {
      wx.navigateTo({url: `/subCourse/joinCamp/joinCamp?id=${id}`})
    }
  },
  main() {
    queryUserJoinedBootCamp({offset: this.data.offset, limit: this.data.limit}).then((list) => {

      if (list.length !== this.data.limit) {
        this.setData({noMore: true})
      }

      let oldOffset = this.data.offset
      let oldList = this.data.campList
      list = list.map(t => {
        return {
          ...t.kecheng_traincamp,
          date: t.date
        }
      })

      let resultCampList = [...oldList, ...list]

      resultCampList = resultCampList.map((item) => {
        // 判断训练营是否还未开始
        if (dayjs(item.date).isAfter(dayjs(dayjs().format("YYYY-MM-DD")))) {
          item._slut = true // 即将开营
        }
        return item
      })

      this.setData({campList: resultCampList, offset: oldOffset + list.length})
      // this.setData({campList: [], offset: 0})

      if (this.data.campList.length === 0) {
        getRecommendBootcampInMine({offset: this.data.recommendOffset, limit: this.data.recommendLimit, status: 1}).then((recommendList) => {

          if (recommendList.length !== this.data.recommendLimit) {
            this.setData({noMoreRecommend: true})
          }

          let oldRecommendOffset = this.data.recommendOffset
          let oldRecommendList = this.data.recommendList

          this.setData({recommendList: [...oldRecommendList, ...recommendList], recommendOffset: oldRecommendOffset + recommendList.length})
        })
      }
    })
  }
})
