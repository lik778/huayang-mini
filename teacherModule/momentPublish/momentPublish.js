// teacherModule/momentPublish/momentPublish.js
import request from "../../lib/request"
import {
  uploadVideoToAli
} from "../../utils/util"
import {
  publishTeacherNewMoment
} from "../../api/teacherModule/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639626899gtUcEr.jpg",
    deleteIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639705558KUnCxn.jpg",
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    previewImageList: [],
    momentInputValue: '',
    teacherId: "",
    mediaType: 'image',
    lock: false,
    showControls: false,
    playingVideo: false
  },

  /* 动态视频进/退全屏 */
  switchControls(e) {
    if (e.detail.fullScreen) {
      this.setData({
        showControls: true
      })
    } else {
      this.videoContext.pause()
      this.setData({
        showControls: false,
        playingVideo: false,
      })
    }
  },

  /* 播放动态视频 */
  playVideo() {
    this.videoContext = wx.createVideoContext(`moment-video`, this)
    this.setData({
      playingVideo: true,
    }, () => {
      setTimeout(() => {
        this.videoContext.requestFullScreen()
        this.videoContext.play()
      }, 200)
    })
  },

  /* 发布动态 */
  publishMoment() {
    if (this.data.momentInputValue.trim() === '') {
      wx.showToast({
        title: '请输入动态内容',
        icon: "none"
      })
      return
    } else if (!this.data.previewImageList.length) {
      wx.showToast({
        title: '请上传图片/视频',
        icon: "none"
      })
      return
    }
    if (!this.data.lock) {
      this.setData({
        lock: true
      })
      let mediaList = []
      this.data.previewImageList.map(item => {
        mediaList.push(item.src)
      })
      publishTeacherNewMoment({
        tutor_id: this.data.teacherId,
        content: this.data.momentInputValue,
        type: this.data.mediaType === 'image' ? 1 : 2,
        media_url: mediaList.join(',')
      }).then(() => {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.setData({
            lock: false
          })
          wx.navigateTo({
            url: `/teacherModule/momentList/momentList?teacherId=${this.data.teacherId}`,
          })
        }, 2000)
      }).catch(() => {
        this.setData({
          lock: false
        })
      })
    }

    console.log(this.data.momentInputValue, this.data.previewImageList, this.data.mediaType)
  },

  /* 上传动态视频 */
  uploadMomentImage() {
    wx.chooseMedia({
      count: 9 - (this.data.previewImageList.length),
      success: async res => {
        let list = res.tempFiles
        if (res.type === 'video') {
          let url = list[0].tempFilePath
          let link = await uploadVideoToAli(url)
          let previewImageList = this.data.previewImageList.concat([])
          previewImageList.push({
            type: 2,
            src: link
          })
          this.setData({
            previewImageList,
            mediaType: "video"
          })
        } else {
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          let promiseArr = list.map(async item => {
            return new Promise(resolve => {
              wx.uploadFile({
                filePath: item.tempFilePath,
                name: 'hyimage',
                url: `${request.baseUrl}/hy/wx/applets/image/upload`,
                success: (res1) => {
                  let data = JSON.parse(res1.data)
                  let imgLink = data.data
                  console.log(imgLink)
                  resolve({
                    src: imgLink,
                    type: 1
                  })
                }
              })
            })
          })
          let link = await Promise.all(promiseArr)
          let oldList = this.data.previewImageList.concat(link)
          wx.hideLoading()
          this.setData({
            previewImageList: oldList,
            mediaType: "image"
          })
        }
      }
    })
  },

  /* 删除图片 */
  deleteImage(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.previewImageList.concat([])
    list.splice(index, 1)
    if (!list.length) {
      this.setData({
        mediaType: 'image'
      })
    }
    this.setData({
      previewImageList: list
    })
  },

  /* 输入动态内容 */
  inputMomentValue(e) {
    let value = e.detail.value
    this.setData({
      momentInputValue: value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.teacherId) {
      this.setData({
        teacherId: options.teacherId
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
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