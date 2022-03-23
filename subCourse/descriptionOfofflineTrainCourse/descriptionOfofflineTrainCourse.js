// subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse.js
import {
  getOfflineCourseDetailOfIndex
} from "../../api/course/index"
import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    id: "",
    playing: false
  },

  playVideoTap() {
    this.data.previewVideo.play()
    this.setData({
      playing: true
    })
  },

  pauseTap() {
    this.setData({
      playing: false
    })
  },

  getDetail() {
    getOfflineCourseDetailOfIndex({
      id: this.data.id
    }).then(({
      data
    }) => {
      let info = {
        ...data,
        image: data.desc_pic_url.split(","),
        height: data.video_url ? Number(data.video_bottom_height) + 1302 : ''
      }
      this.setData({
        info
      })
      wx.setNavigationBarTitle({
        title: info.name || '线下培训'
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    }, () => {
      this.getDetail()
    })

  },

  /* 联系客服 */
  contactService() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfce6a22d7afb999123'
      },
      corpId: 'ww8d4cae43fb34dc92',
      complete() {
        bxPoint("course_service_click", {}, false)
      }
    })
  },

  onReady() {
    this.data.previewVideo = wx.createVideoContext("video", this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.info.name,
      path: `/subCourse/descriptionOfofflineTrainCourse/descriptionOfofflineTrainCourse?id=${this.data.info.id}`
    }
  }
})
