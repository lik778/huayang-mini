import { getPhotoAlbumDetail } from "../../api/albums/index"
import { $notNull } from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    albumId: 0,
    albumInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let link = decodeURIComponent(options.link)
    let albumId = link.match(/[^\/]*$/)[0]
    if (link) {
      this.setData({link, albumId})
      this.run()
    }
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
    return {
      title: $notNull(this.data.albumInfo) ? this.data.albumInfo.name : "",
      path: `/pages/activityAlbum/activityAlbum?link=https%3A%2F%2Fhuayang.baixing.com%2F%23%2Fhome%2Falbums%2F${this.data.albumId}`
    }
  },
  run() {
    getPhotoAlbumDetail({album_id: this.data.albumId})
      .then((data) => {
        this.setData({albumInfo: data})
      })
  }
})
