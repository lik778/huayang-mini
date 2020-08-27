// subCourse/campDetail/campDetail.js
import {
  GLOBAL_KEY
} from '../../lib/config'
import {
  getProductInfo,
  getYouZanAppId
} from '../../api/mall/index'
import {
  getArticileLink,
  getCampDetail,
  getCourseData,
  getCurentDayData,
  getHasJoinCamp,
  getMenyCourseList,
} from '../../api/course/index'
import {
  countDay,
  countDayOne,
  getLocalStorage,
  getTodayDate,
  manageWeek,
  setLocalStorage,
  simpleDurationSimple,
} from '../../utils/util'
import bxPoint from '../../utils/bxPoint'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    appId: '',
    showLock: false,
    statusHeight: 0,
    articileLink: '',
    realNowDay: '',
    endTime: '',
    bgStyle: '',
    bgImgStyle: "",
    backIndex: false,
    cureentDay: '', //当前日期
    campId: 0, //训练营id
    showCover: false, //显示引导私欲弹窗
    showVideoCover: true, //显示视频播放按钮
    videoHeight: 0, //视频高度
    campDetailData: {}, //训练营详情
    courseList: [], //课程列表
    startDay: '', //训练营开始时间
    videoSrc: '', //视频地址
    srcObj: {
      course: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925TZrmey.jpg',
      video: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925iFZICS.jpg',
      product: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925fmEUmR.jpg',
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925KAfZPv.jpg',
      lock: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1596613255fHAzmw.jpg',
    },
    posterSrc: '',
    styleObj: {
      all: 'color:#000000;font-family:PingFang-SC-Bold,PingFang-SC;font-weight:bold;background:#F4F4F4',
      notAll: 'color:#000000;background:#F4F4F4',
    }, //日历的不同样式
    dateObj: {
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      dateList: [],
    }, //日历时间存储
  },
  // 返回上一页
  toLast() {
    wx.switchTab({
      url: '/pages/practice/practice',
    })
  },

  // 加入交流群
  toTeam() {
    bxPoint('guide_wx', {}, false)
    let link = this.data.articileLink
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${link}`,
    })
  },

  // 获取训练营信息
  getCampDetailData({
    id,
    startDate
  }) {
    getCampDetail({
      traincamp_id: id,
    }).then((res) => {
      let date = new Date()
      let year = date.getFullYear()
      let month =
        date.getMonth() + 1 < 10 ?
        '0' + (date.getMonth() + 1) :
        date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let nowDate = year + '-' + month + '-' + day
      res.nowDay =
        countDay(nowDate, startDate) < 0 ? 0 : countDay(nowDate, startDate)
      let onlyDayList = getTodayDate().one //只有日的日期列表
      let realList = getTodayDate().two //实际一周日期列表
      let campDateList = [] //当周对应训练营日期列表
      let cureentDay = ''
      let weekData = manageWeek()
      if (new Date(startDate) > new Date()) {
        // 未开营
        onlyDayList = getTodayDate(startDate).one //只有日的日期列表
        realList = getTodayDate(startDate).two //实际一周日期列表
        // cureentDay = new Date(startDate).getDate() - 1
        for (let i in onlyDayList) {
          if (onlyDayList[i].id === startDate.split("-")[2]) {
            console.log(onlyDayList)
            cureentDay = onlyDayList[i - 1].id
          }
        }
      } else {
        cureentDay = new Date().getDate()
      }
      for (let i in realList) {
        let differDay = countDayOne(realList[i], startDate)
        campDateList.push(differDay)
        if (
          new Date(realList[i]).toLocaleDateString() ===
          new Date().toLocaleDateString()
        ) {
          weekData[i] = '今天'
        }
      }
    
      // 批量获取多日课程内容
      this.batchGetCourse(campDateList)
      // 获取当日课程
      res.nowDate = cureentDay
      this.toCureentDay(res)
      this.setData({
        campDetailData: res,
        cureentDay: cureentDay,
        bgStyle: `background-image: url(${res.cover_pic})`,
        dateObj: {
          weekList: weekData,
          dateList: {
            date: onlyDayList,
            realDate: realList,
          },
        },
      })
    })
  },

  // 批量获取多日课程内容
  batchGetCourse(e) {
   
    getMenyCourseList({
      day_num_str: e.join(','),
      traincamp_id: this.data.campId,
    }).then((res) => {
      let dataObj = this.data.dateObj.dateList.date
      for (let i in dataObj) {
        dataObj[i].day_num = e[i]
        for (let j in res) {
          if (!Array.isArray(res[j].content)) {
            res[j].content = JSON.parse(res[j].content)
          }
          if (res[j].content.length > 0) {
            if (res[j].day_num === dataObj[i].day_num) {
              dataObj[i].dataNum = 1
            }
          }
        }
      }
      this.setData({
        dateObj: this.data.dateObj,
      })
    })
  },

  // 获取当前天的课程
  toCureentDay(e) {
    
    let dayNum = ''
    let day = ''
    if (e.currentTarget) {
      let event = e.currentTarget.dataset.item.dataNum
      if (event < 0 || event === undefined) return
      if (event >= 0) {
        dayNum = e.currentTarget.dataset.item.day_num
      }
      let nowDate = this.getNowTimeStr()
      let date = new Date(nowDate).getTime() //当前日期
      let clickDay = e.currentTarget.dataset.item.id
      let str1 = ''
      let dateList = this.data.dateObj.dateList.date
      let realList = this.data.dateObj.dateList.realDate
      for (let i in dateList) {
        if (dateList[i].id === clickDay) {
          str1 = realList[i].replace(/-/g, "/")
        }
      }
      let date1 = new Date(str1).getTime() //开营日期
      if (date < date1) {
        this.setData({
          showLock: true,
        })
      } else {
        this.setData({
          showLock: false,
        })
      }
      
      this.setData({
        cureentDay: e.currentTarget.dataset.item.id,
      })
    } else {
      // start_date
      if (new Date(this.data.startTime) > new Date()) {
        // 未开营
        dayNum = 0
      } else {
        // 已开营
        // dayNum = 0
        let endTime = this.data.startTime
        let date = new Date()
        let year = date.getFullYear()
        let month =
          date.getMonth() + 1 < 10 ?
          '0' + (date.getMonth() + 1) :
          date.getMonth() + 1
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let nowDate = year + '-' + month + '-' + day
        dayNum = countDayOne(nowDate, endTime)
        let Str = this.getNowTimeStr()
        let date1 = new Date(Str).getTime() //当前日期
        let date2 = new Date(e.nowDate).getTime() //开营日期
        if (date1 < date2) {
          this.setData({
            showLock: true,
          })
        } else {
          this.setData({
            showLock: false,
          })
        }
      }
    }
    this.setData({
      videoSrc: '',
      posterSrc: '',
    })
    if (dayNum == 0) {
      this.setData({
        showLock: false,
      })
    }
    getCurentDayData({
        day_num: dayNum,
        traincamp_id: this.data.campId,
      })
      .then((res) => {
        if (res.length !== 0) {
          res.content = JSON.parse(res.content)
          for (let i in res.content) {
            if (res.content[i].type === 'kecheng') {
              getCourseData({
                kecheng_id: res.content[i].kecheng_id,
              }).then((res1) => {
                if (res1.length === 0) {
                  res.content[i].duration = 0 + '分钟'
                } else {
                  res.content[i].duration = simpleDurationSimple(res1.duration)
                }
                this.setData({
                  courseList: res,
                })
              })
            }
            if (res.content[i].type === 'video' && this.data.videoSrc === '') {
              this.setData({
                videoSrc: res.content[i].video,
                posterSrc: res.content[i].cover,
              })
            }
          }
          this.setData({
            courseList: res,
          })
        } else {
          this.setData({
            courseList: [],
          })
        }
      })
      .catch(() => {
        this.setData({
          courseList: [],
        })
      })
  },
  // 获取当前日期时间戳
  getNowTimeStr() {
    let day = ''
    let date = new Date()
    let year = date.getFullYear()
    let month =
      date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1
    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let nowDate = year + '/' + month + '/' + day
    return nowDate
  },
  // 获取引导私域地址
  getArticileLinkData() {
    getArticileLink().then((res) => {
      this.setData({
        articileLink: res,
      })
    })
  },
  // 控制是否显示遮罩层
  initCoverShow(id) {
    let showIdList =
      getLocalStorage(GLOBAL_KEY.campHasShowList) === undefined ?
      undefined :
      JSON.parse(getLocalStorage(GLOBAL_KEY.campHasShowList))
    let showCover = true
    if (showIdList === undefined) {
      setLocalStorage(GLOBAL_KEY.campHasShowList, [id])
      showCover = true
    } else {
      if (showIdList.indexOf(id) !== -1) {
        showCover = false
      } else {
        showIdList.push(id)
        setLocalStorage(GLOBAL_KEY.campHasShowList, showIdList)
        showCover = true
      }
    }
    this.setData({
      showCover: showCover,
    })
  },

  hideCover() {
    this.setData({
      showVideoCover: false,
    })
  },
  // 播放/暂停视频
  playVideo() {
    this.videoContext.play()
    this.videoContext.requestFullScreen()
    this.setData({
      showVideoCover: false,
    })
  },

  // 暂停视频
  pauseVideo() {
    this.videoContext.pause()
    this.setData({
      showVideoCover: true,
    })
  },

  // 播放结束初始化
  initVideo() {
    this.setData({
      showVideoCover: true,
    })
  },

  // 关闭遮罩层
  closeCover() {
    this.setData({
      showCover: false,
    })
  },

  // 跳往商品详情
  toProduct(e) {
    let data = e.currentTarget.dataset.item
    if (data.type === 'product') {
      // 商品
      getProductInfo({
        product_id: data.product_id,
        // product_id: 37
      }).then((res) => {
        wx.navigateToMiniProgram({
          appId: this.data.appId,
          path: res.product.third_link,
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
        kecheng_id: data.kecheng_id,
      }).then((res) => {
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
              url: `/subCourse/practiceDetail/practiceDetail?courseId=${res.id}&parentBootCampId=${this.data.campId}&formCampDetail=payUser`,
            })
          }
        } else {
          wx.showToast({
            title: '课程不存在',
            icon: 'none',
            duration: 3000,
          })
        }
      })
    } else {
      // 直接播放视频
      this.setData({
        videoSrc: data.video,
        posterSrc: data.cover,
      })
      this.playVideo()
    }
  },

  // 获取有赞id
  getAppId() {
    getYouZanAppId().then((appId) => {
      this.setData({
        appId,
      })
    })
  },
  // 跳转到训练营详情
  checkCamp(id) {
    getHasJoinCamp({
      traincamp_id: id,
    }).then((res) => {
      this.setData({
        startTime: res.date,
      })
      this.getCampDetailData({
        id: id,
        startDate: res.date,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      id,
      share
    } = options

    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/')
      let [sceneSource = ''] = sceneAry

      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
    }

    if (share) {
      this.setData({
        backIndex: true,
      })
    }

    this.checkCamp(id)
    this.initCoverShow(id)
    this.getAppId()
    this.setData({
      campId: id
    })

    // 记录起始页面地址
		if (!getApp().globalData.firstViewPage && getCurrentPages().length > 0) {
			getApp().globalData.firstViewPage = getCurrentPages()[0].route
		}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    let systemInfo = wx.getMenuButtonBoundingClientRect().top
    this.setData({
      bgImgStyle: `top:${systemInfo}px`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    bxPoint('camp_calendar', {
      from_uid: getApp().globalData.super_user_id,
    })
    this.getArticileLinkData()
    let height = parseInt(
      ((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth - 30) /
        16) *
      9
    )
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
        .statusBarHeight,
      videoHeight: `height:${height}px`,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `我正在参加${this.data.campDetailData.name}，每天都有看的见的变化，快来试试`,
      path: '/subCourse/joinCamp/joinCamp?id=' +
        this.data.campId +
        `&invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}&share=true`,
    }
  },
})