// subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse.js
import {
  offlineTrainList
} from "../../utils/mock"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    offlineTrainList.map(item => {
      if (Number(item.id) === Number(options.id)) {
        item.description_image = item.description_image ? item.description_image.split(',') : []
        wx.setNavigationBarTitle({
          title: item.title
        })
        this.setData({
          info: item
        })
      }
    })
  },

  /* 联系客服 */
  contactService() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc85fe86a0e7ad8fa3'
      },
      corpId: 'ww8d4cae43fb34dc92',
      success(res) {}
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})