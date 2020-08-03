// subCourse/campDetail/campDetail.js
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getProductInfo,
  getYouZanAppId
} from '../../api/mall/index'
import {
  getCampDetail,
  getCurentDayData,
  getMenyCourseList,
  getCourseData
} from "../../api/course/index"
import {
  getLocalStorage,
  getTodayDate,
  manageWeek,
  setLocalStorage,
  countDay,
  countDayOne,
  simpleDurationSimple
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: "",
    statusHeight: 0,
    cureentDay: '', //当前日期
    campId: 0, //训练营id
    showCover: false, //显示引导私欲弹窗
    showVideoCover: true, //显示视频播放按钮
    videoHeight: 0, //视频高度
    campDetailData: {}, //训练营详情
    courseList: [], //课程列表
    startDay: "", //训练营开始时间
    videoSrc: "", //视频地址
    styleObj: {
      all: "color:#000000;font-family:PingFang-SC-Bold,PingFang-SC;font-weight:bold;background:#F4F4F4",
      notAll: "color:#000000;background:#F4F4F4"
    }, //日历的不同样式
    dateObj: {
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      dateList: [],
    } //日历时间存储
  },

  // 获取训练营信息
  getCampDetailData(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      res.nowDay = countDay(new Date(), res.start_date) < 0 ? 0 : countDay(new Date(), res.start_date)
      let onlyDayList = getTodayDate().one //只有日的日期列表
      let realList = getTodayDate().two //实际一周日期列表
      let campDateList = [] //当周对应训练营日期列表
      let cureentDay = ''
      let weekData = manageWeek()
      if (new Date(res.start_date) > new Date()) {
        // 未开营
        onlyDayList = getTodayDate(res.start_date).one //只有日的日期列表
        realList = getTodayDate(res.start_date).two //实际一周日期列表
        cureentDay = new Date(res.start_date).getDate()
      } else {
        cureentDay = new Date().getDate()
      }
      for (let i in realList) {
        let differDay = countDayOne(realList[i], res.start_date)
        differDay = differDay < 0 ? 0 : differDay
        campDateList.push(differDay)
      }
      for (let i in realList) {
        if (new Date(realList[i]).toLocaleDateString() === new Date().toLocaleDateString()) {
          weekData[i] = '今天'
        }
      }
      // 批量获取多日课程内容
      this.batchGetCourse(campDateList)
      // 获取当日课程
      this.toCureentDay(res)
      this.setData({
        campDetailData: res,
        cureentDay: cureentDay,
        dateObj: {
          weekList: weekData,
          dateList: {
            date: onlyDayList,
            realDate: realList
          }
        }
      })
    })
  },

  // 批量获取多日课程内容
  batchGetCourse(e) {
    getMenyCourseList({
      day_num_str: e.join(","),
      traincamp_id: this.data.campId
    }).then(res => {
      let dataObj = this.data.dateObj.dateList.date
      for (let i in res) {
        res[i].content = JSON.parse(res[i].content)
        for (let j in e) {
          if (e[j] === res[i].day_num + 1) {
            dataObj[j].dataNum = 1
          } else {
            dataObj[j].dataNum = 0
          }
        }
      }
      this.setData({
        dateObj: this.data.dateObj
      })
    })
  },

  // 获取当前天的课程
  toCureentDay(e) {
    let dayNum = ''
    if (e.currentTarget) {
      if (e.currentTarget.dataset.item.dataNum === 0) return
      dayNum = e.currentTarget.dataset.item.dataNum
      this.setData({
        cureentDay: e.currentTarget.dataset.item.id
      })
    } else {
      if (new Date(e.start_date) > new Date()) {
        // 未开营
        dayNum = 0
      } else {
        // 已开营
        dayNum = 0
      }
    }
    getCurentDayData({
      day_num: dayNum,
      traincamp_id: this.data.campId
    }).then(res => {
      if (res.length !== 0) {
        res.content = JSON.parse(res.content)
        for (let i in res.content) {
          if (res.content[i].type === 'kecheng') {
            getCourseData({
              kecheng_id: res.content[i].kecheng_id
            }).then(res1 => {
              if (res1.length === 0) {
                res.content[i].duration = 0 + "分钟"
              } else {
                res.content[i].duration = simpleDurationSimple(res1.duration)
              }
              this.setData({
                courseList: res
              })
            })
          }
          if (res.content[i].type === 'video' && this.data.videoSrc === '') {
            this.setData({
              videoSrc: res.content[i].video
            })
          }
        }
        this.setData({
          courseList: res
        })
      } else {
        this.setData({
          courseList: []
        })
      }
    }).catch(() => {
      this.setData({
        courseList: []
      })
    })
  },

  // 控制是否显示遮罩层
  initCoverShow(id) {
    let showIdList = getLocalStorage(GLOBAL_KEY.campHasShowList) === undefined ? undefined : JSON.parse(getLocalStorage(GLOBAL_KEY.campHasShowList))
    let showCover = true
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
    this.setData({
      showVideoCover: true
    })
  },

  // 关闭遮罩层
  closeCover() {
    this.setData({
      showCover: false
    })
  },

  // 跳往商品详情
  toProduct(e) {
    let data = e.currentTarget.dataset.item
    if (data.type === 'product') {
      // 商品
      getProductInfo({
        product_id: data.product_id
        // product_id: 37
      }).then((res) => {
        wx.navigateToMiniProgram({
          appId: this.data.appId,
          path: res.product.third_link
        })
      })
    }
  },

  // 跳转详情页
  toDetail(e) {
    let data = e.currentTarget.dataset.item
    if (data.type === 'kecheng') {
      // 跳往结构化练习
      getCourseData({
        kecheng_id: data.kecheng_id
      }).then(res => {
        console.log(res)
      })
    } else {
      // 直接播放视频
      this.setData({
        videoSrc: data.video
      })
      this.playVideo()
    }
    // console.log(e.currentTarget.dataset.item)
    // if (e.type === 'kecheng') {
    //   // 课程
    // } else if (e.type === 'video') {
    //   // 视频
    // } else if (e.type === 'product') {
    //   // 商品
    // } else if (e.type === 'url') {
    //   // url
    // }
    // console.log(e.currentTarget.dataset.type)
  },
  // 获取有赞id
  getAppId() {
    getYouZanAppId().then(appId => {
      this.setData({
        appId
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCampDetailData(options.id)
    this.initCoverShow(options.id)
    this.getAppId()
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