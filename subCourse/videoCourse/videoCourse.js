// subCourse/videoCourse/videoCourse.js
import {
  getLocalStorage,
  setLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  simpleDurationSimple,
  simpleDurationDate,
  simpleDuration
} from "../../utils/util"
import {
  getVideoCourseList,
  getVideoCourseDetail
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAuth: false,
    playIndex: 0,
    buttonType: 4,
    courseData: '',
    showMore: true,
    hasLogin: false
  },
  // 播放课程
  playCourse(e) {
    this.setData({
      playIndex: parseInt(e.currentTarget.dataset.index)
    })
  },
  // 加入课程
  joinVideoCourse() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? '' : JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    if (userInfo === '') {
      this.setData({
        didShowAuth: true
      })
      return
    } else {
      console.log(userInfo)
    }
  },
  // 获取课程列表
  getVideoList() {
    getVideoCourseList().then(res => {
      console.log(res)
    })
  },
  // 获取课程详情
  getVideoDetail() {
    getVideoCourseDetail({
      series_id: 12
    }).then(res => {
      let showMore = false
      let videoListAll = null
      res.detail_pics = res.detail_pics.split(",")
      videoListAll = JSON.parse(res.video_detail)
      for (let i in videoListAll) {
        videoListAll[i].time = simpleDurationDate(videoListAll[i].time,'s')
      }
      res.video_detail = videoListAll.slice(0, 3)
      if (videoListAll.length > 3) {
        showMore = true
      }
      // this.getVideoTime(res.video_detail).then(res1 => {
      //   res.video_detail = res1.slice(0, 3)
      //   this.setData({
      //     courseData: res,
      //     videoListAll: res1
      //   })
      // })
      // res.video_detail = res1.slice(0, 3)
      this.setData({
        courseData: res,
        videoListAll: videoListAll,
        showMore: showMore
      })
    })
  },
  // 展开全部
  showMore() {
    let data = this.data.courseData
    data.video_detail = this.data.videoListAll
    this.setData({
      courseData: data,
      showMore: false
    })
  },
  // 视频课程时长获取
  getVideoTime(list) {
    return new Promise(resolve => {
      for (let i in list) {
        wx.downloadFile({ //需要先下载文件获取临时文件路径 单个文件大小不得超过50M
          url: list[i].url,
          success: res => {
            //获取视频相关信息
            wx.getVideoInfo({
              src: res.tempFilePath, //视频临时路径
              success: res1 => {
                list[i].time = parseInt(res1.duration)
                console.log(list)
                resolve(list)
              },
            })
          }
        })
      }
    })

  },
  // 授权弹窗取消回调
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 授权弹窗确认回调
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoDetail()
    if (hasAccountInfo() &&
      hasUserInfo()) {
      // 已经登录
      this.setData({
        hasLogin: true
      })
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

  }
})