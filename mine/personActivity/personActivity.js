import { getActivityInMine, getRecommendBootcampInMine } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import request from "../../lib/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    activityList: [],
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
  // 查看活动详情
  viewActivityDetail(e) {
    let { id } = e.currentTarget.dataset.item
    if (id) {
      let link = `${request.baseUrl}/#/home/detail/${id}`
      wx.navigateTo({url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(link)}`})
    }
  },
  // 跳转到训练营详情
  joinCamp(e) {
    let { id } = e.currentTarget.dataset.index
    if (id) {
      wx.navigateTo({url: `/subCourse/joinCamp/joinCamp?id=${id}`})
    }
  },
  main() {
    this.setData({statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight})

    getActivityInMine({
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      status: 1,
      platform: 1,
      offset: this.data.offset,
      limit: this.data.limit
    }).then((list) => {

      if (list.length !== this.data.limit) {
        this.setData({noMore: true})
      }

      let oldOffset = this.data.offset
      let oldList = this.data.activityList
      list = list.map(t => t.activity)

      this.setData({activityList: [...oldList, ...list], offset: oldOffset + list.length})
      // this.setData({activityList: [], offset: 0})

      if (this.data.activityList.length === 0) {
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
