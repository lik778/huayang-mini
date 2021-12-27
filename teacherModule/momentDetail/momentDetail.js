// teacherModule/momentDetail/momentDetail.js
import {
  getTeacherNewMomentDetail,
  getTeacherNewInfo,
  deleteTeacherNewMoment
} from "../../api/teacherModule/index"
import dayjs from "dayjs";
import {
  getLocalStorage
} from "../../utils/util";
import {
  GLOBAL_KEY
} from "../../lib/config";
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    momentId: "",
    momentDetailInfo: "",
    teacherInfo: "",
    playingVideo: false,
    showControls: false,
    isOwner: false,
    teacherUserId: '',
    backPath: ""
  },


  /* 预览图片 */
  previewImage(e) {
    let item = e.currentTarget.dataset.item
    wx.previewImage({
      urls: this.data.momentDetailInfo.mediaUrl,
      current: item
    })
  },

  /* 删除动态 */
  deleteMoment() {
    wx.showModal({
      content: "确认删除",
      confirmText: "删除",
      confirmColor: '#ff5544',
      success: (res) => {
        if (res.confirm) {
          deleteTeacherNewMoment({
            dynamic_id: this.data.momentDetailInfo.id
          }).then(() => {
            wx.showToast({
              title: '删除成功',
              icon: "success",

            })
            setTimeout(() => {
              wx.navigateTo({
                url: `/teacherModule/momentList/momentList?teacherId=${this.data.momentDetailInfo.tutor_id}&teacherUserId=${this.data.teacherUserId}`,
              })
            }, 2000)
          })
        }
      }
    })
  },

  /* 初始化登录状态 */
  initUserAuthStatus() {
    let publishUserId = this.data.teacherUserId
    let authUserId = getLocalStorage(GLOBAL_KEY.userId) ? getLocalStorage(GLOBAL_KEY.userId) : ''
    if (Number(publishUserId) === Number(authUserId)) {
      this.setData({
        isOwner: true
      })
    } else {
      this.setData({
        isOwner: false
      })
    }
  },

  /* 进/退全屏 */
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

  /* 获取老师信息 */
  getTeacherInfo() {

    bxPoint('teacher_my_trends_page', {
      teacher_id: this.data.momentDetailInfo.tutor_id
    })

    getTeacherNewInfo({
      tutor_id: this.data.momentDetailInfo.tutor_id
    }).then(({
      data
    }) => {
      data.headIcon = data.tutor_info.photo_wall.split(',')[0]
      this.setData({
        teacherInfo: data
      })
    })
  },

  /* 获取动态详情 */
  getMomentDetail() {
    getTeacherNewMomentDetail({
      dynamic_id: this.data.momentId
    }).then(({
      data
    }) => {
      if (data.type === 2) {
        data.mediaType = 3
      } else {
        let url = data.media_url.split(',')
        if (url.length <= 1) {
          data.mediaType = 1
        } else {
          data.mediaType = 2
        }
        data.mediaUrl = url
      }

      let time = data.time.split(" ")[0]
      let yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      let today = dayjs().format('YYYY-MM-DD')
      if (dayjs(time).isSame(dayjs(yestoday))) {
        data.dateType = '昨天 ' + dayjs(data.time).format("HH:mm")
      } else if (dayjs(time).isSame(dayjs(today))) {
        data.dateType = '今天 ' + dayjs(data.time).format("HH:mm")
      } else {
        data.dateType = dayjs(data.time).format("YYYY年MM月DD日 HH:mm")
      }

      this.setData({
        momentDetailInfo: data,
        backPath: `/teacherModule/momentList/momentList?teacherId=${data.tutor_id}&teacherUserId=${getLocalStorage(GLOBAL_KEY.userId)}`
      }, () => {
        this.getTeacherInfo()
        this.initUserAuthStatus()
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.momentId && options.teacherUserId) {
      this.setData({
        momentId: options.momentId,
        teacherUserId: options.teacherUserId,

      }, () => {

        this.getMomentDetail()

      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "有一条你关注的动态",
      path: `/teacherModule/index/index?teacherId=${this.data.momentDetailInfo.tutor_id}`
    }
  }
})