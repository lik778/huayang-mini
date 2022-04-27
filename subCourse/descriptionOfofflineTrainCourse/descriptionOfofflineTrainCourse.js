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
        ...data
      }
      info.image = info.desc_pic_url.split(',')

      info.image = info.video_url ? [info.image.slice(0, 2), info.image.slice(2, info.image.length)] : info.image

      console.log(info)

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
      bxPoint('offlinecourse_page', {
        offlinecourse_id: options.id
      })
      this.getDetail()
    })

  },

  /* 联系客服 */
  contactService() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfcdba4386d5d74c0b5'
      },
      corpId: 'ww8d4cae43fb34dc92',
      complete: () => {
        bxPoint("offlinecourse_contact_click", {
          offlinecourse_id: this.data.id
        }, false)
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