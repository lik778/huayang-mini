// subCourse/campDetail/campDetail.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getCampDetail,
  getCurentDayData
} from "../../api/course/index"
import {
  getLocalStorage,
  getTodayDate,
  manageWeek,
  setLocalStorage,
  countDay
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    cureentDay: new Date().getDate(),
    campId: 0,
    showCover: false,
    showVideoCover: true,
    videoHeight: 0,
    campDetailData: {},
    courseList: [],
    videoSrc: "http://video.699pic.com/videos/46/49/94/a_IEHicAfXgsM41594464994.mp4",
    styleObj: {
      all: "color:#000000;font-family:PingFang-SC-Bold,PingFang-SC,font-weight:bold;background:#F4F4F4",
      notAll: "color:#000000;background:#F4F4F4"
    },
    dateObj: {
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      dateList: []
    }
  },
  // 播放/暂停视频
  playVideo() {
    this.videoContext.play()
    this.setData({
      showVideoCover: false
    })
  },
  // 暂停视频
  pauseVideo() {
    this.videoContext.pause()
    this.setData({
      showVideoCover: true
    })
  },
  // 播放结束初始化
  initVideo() {
    console.log(11)
    this.setData({
      showVideoCover: true
    })
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      res.nowDay = countDay(new Date(), res.start_date) < 0 ? 0 : countDay(new Date(), res.start_date)
      this.getCurentDayData(res.start_date)
      this.setData({
        campDetailData: res
      })
    })
  },
  // 获取日历信息
  getTodayDate(e) {

    this.setData({
      dateObj: {
        weekList: manageWeek(),
        dateList: e ? getTodayDate(e) : getTodayDate()
      }
    })
  },
  // 关闭遮罩层
  closeCover() {
    this.setData({
      showCover: false
    })
  },
  // 跳转详情页
  toDetail(e) {
    if (e.type === 'kecheng') {
      // 课程
    } else if (e.type === 'video') {
      // 视频
    } else if (e.type === 'product') {
      // 商品
    } else if (e.type === 'url') {
      // url
    }
    console.log(e.currentTarget.dataset.type)
  },
  // 获取单日课程内容
  getCurentDayData(e) {
    let nowTime = Date.parse(new Date()); //当前日期
    let totalTime = Date.parse(new Date(e)) //目标日期
    let dayNum = ''
    if (nowTime < totalTime) {
      // 还未开始
      dayNum = 1
      this.getTodayDate('2020-08-20')
    } else {
      dayNum = this.campDetailData.nowDay
    }
    getCurentDayData({
      day_num: dayNum,
      traincamp_id: this.data.campId
    }).then(res => {
      this.setData({
        courseList: JSON.parse(res.content)
      })
      console.log(this.data.courseList)
    })
  },
  // 控制是否显示遮罩层
  initCoverShow(id) {
    let showIdList = getLocalStorage(GLOBAL_KEY.campHasShowList) === undefined ? undefined : JSON.parse(getLocalStorage(GLOBAL_KEY.campHasShowList))
    let showCover = true
    console.log(showIdList)
    if (showIdList === undefined) {
      setLocalStorage(GLOBAL_KEY.campHasShowList, [id])
      showCover = true
    } else {
      if (showIdList.indexOf(id) !== -1) {
        showCover = false
      } else {
        showCover = true
      }
    }
    this.setData({
      showCover: showCover
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currenDay = new Date().getDay();
    this.getCampDetail(options.id)
    this.initCoverShow(options.id)
    this.setData({
      campId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let height = parseInt((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth - 30) / 16 * 9)
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      videoHeight: `height:${height}px`
    })
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