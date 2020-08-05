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
    showLock: false,
    statusHeight: 0,
    realNowDay: "",
    backIndex: false,
    cureentDay: '', //当前日期
    campId: 0, //训练营id
    showCover: false, //显示引导私欲弹窗
    showVideoCover: true, //显示视频播放按钮
    videoHeight: 0, //视频高度
    campDetailData: {}, //训练营详情
    courseList: [], //课程列表
    startDay: "", //训练营开始时间
    videoSrc: "", //视频地址
    srcObj: {
      course: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596592012ePAuNo.jpg",
      video: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596592012extlpo.jpg",
      product: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596592012KEkZvd.jpg",
      url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596592012prmJUG.jpg",
      lock: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596613255fHAzmw.jpg"
    },
    styleObj: {
      all: "color:#000000;font-family:PingFang-SC-Bold,PingFang-SC;font-weight:bold;background:#F4F4F4",
      notAll: "color:#000000;background:#F4F4F4"
    }, //日历的不同样式
    dateObj: {
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      dateList: [],
    } //日历时间存储
  },

  // 加入交流群
  toTeam() {
    let link = 'https://mp.weixin.qq.com/s/qvNnbFv3OFATevcqidgmww'
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${link}`,
    })
  },

  // 获取训练营信息
  getCampDetailData(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      let endTime = ''
      let dateList = res.start_date.split(',')
      if (dateList.length > 1) {
        // 多个开营日期
        for (let i in dateList) {
          if (endTime === '') {
            endTime = dateList[i]
          } else {
            if (Math.round(new Date(endTime) / 1000) > Math.round(new Date(dateList[i]) / 1000) || Math.round(new Date(dateList[i]) / 1000) > Math.round(new Date() / 1000)) {
              endTime = dateList[i]
            }
          }
        }
        res.nowDay = countDay(new Date(), endTime) < 0 ? 0 : countDay(new Date(), endTime)
      } else {
        res.nowDay = countDay(new Date(), res.start_date) < 0 ? 0 : countDay(new Date(), res.start_date)
      }
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
    console.log(e, 221112)
    getMenyCourseList({
      day_num_str: e.join(","),
      traincamp_id: this.data.campId
    }).then(res => {
      let dataObj = this.data.dateObj.dateList.date
      for (let i in res) {
        res[i].content = JSON.parse(res[i].content)
        for (let j in e) {
          if (e[j] === res[i].day_num + 1) {
            let days = Number(j)
            dataObj[days].dataNum = 1
          } else {
            let days = Number(res[i].day_num)
            dataObj[days].dataNum = 0
          }
        }
      }

      for (let i in e) {
        console.log(e[i], "测试")
        dataObj[i].day_num = e[i]
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
      let event = e.currentTarget.dataset.item.day_num
      console.log(e)
      if (event - 1 < 0) return
      if (event - 1 >= 0) {
        dayNum = event - 1
      }
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
    console.log(dayNum)
    if (dayNum == 0) {
      this.setData({
        showLock: false
      })
    } else {
      this.setData({
        showLock: true
      })
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
    } else {
      wx.navigateTo({
        url: `/pages/webViewCommon/webViewCommon?link=${data.url}`,
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
        if (res.id) {
          if (res.kecheng_type === 0) {
            // 直播
            wx.navigateTo({
              url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${res.room_id}`,
            })
          } else if (res.kecheng_type === 1) {
            // 回看
            wx.navigateTo({
              url: `/subLive/review/review?zhiboRoomId=${res.room_id}`,
            })
          } else if (res.kecheng_type === 2) {
            // 小额通
            wx.navigateTo({
              url: `/pages/webViewCommon/webViewCommon?link=${res.xiaoetong_url}`,
            })
          } else {
            // 结构化
            wx.navigateTo({
              url: `/subCourse/practiceDetail/practiceDetail?courseId=${res.id}`,
            })
          }
        } else {
          wx.showToast({
            title: '课程不存在',
            icon: "none",
            duration: 3000
          })
        }
      })
    } else {
      // 直接播放视频
      this.setData({
        videoSrc: data.video
      })
      this.playVideo()
    }
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
    if (options.share) {
      this.setData({
        backIndex: true
      })
    }
    this.getCampDetailData(options.id)
    this.initCoverShow(options.id)
    this.getAppId()
    this.setData({
      campId: options.id
    })
    setTimeout(() => {
      console.log(this.data.dateObj)
    }, 5000)
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