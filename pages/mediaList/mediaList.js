import { getCompetitionMedia } from "../../api/competition/index"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mediaList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getCompetitionMedia().then(({list}) => {
      list = list || []
      this.setData({mediaList: list})
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
    return {
      title: "2021花样时尚模特大赛，绽放趁现在！",
      path: "/pages/mediaList/mediaList"
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleMediaTap(e) {
    let item = e.currentTarget.dataset.item
    bxPoint("model_news_click", {new_id: item.id, new_title: item.title}, false)
    wx.navigateTo({url: `/mine/normal-web-view/normal-web-view?link=${(item.link_url)}`})
  },
})
