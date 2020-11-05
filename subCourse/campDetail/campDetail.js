// subCourse/trainingCampDetail/trainingCampDetail.js
import {
  getArticileLink,
  getCampDetail,
  getCourseData,
  getCurentDayData,
  getFindBanner,
  getHasJoinCamp,
  getWxRoomData
} from "../../api/course/index"
import {
  getProductInfo,
  getYouZanAppId
} from "../../api/mall/index"
import {
  computeDate,
  dateAddDays,
  getLocalStorage,
  getNowDate,
  setLocalStorage,
  simpleDurationSimple
} from "../../utils/util"
import bxPoint from '../../utils/bxPoint'
import {
  GLOBAL_KEY
} from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campData: "", //训练营信息
    campId: '', //训练营id
    showCover: true, //是否显示视频封面
    showPlayIcon: true, //是否显示播放按钮
    iconSrcList: {
      course: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925TZrmey.jpg',
      video: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925iFZICS.jpg',
      product: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925fmEUmR.jpg',
      url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1597130925KAfZPv.jpg',
      lock: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1603852364xDjojH.jpg",
    }, //课程icon地址
    advertisingIndex: 0, //广告下标
    advertisingList: ['https://goss.veer.com/creative/vcg/veer/800water/veer-360547308.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-353816507.jpg', 'https://goss.veer.com/creative/vcg/veer/800water/veer-351568172.jpg'], //广告地址列表
    hasStartCampType: 1, //是否开营,1未开营，2开营中，3已结束
    joinDate: "", //加入训练营日期
    whatDay: "", //开营第n天
    courseList: [], //课程数组
    videoData: {
      src: "",
      pic: ""
    }, //视频地址以及封面
    articileLink: "", //引导私欲文章地址
    showLock: false, //显示播放锁
    todayDate: "", //今日日期
    endDateStr: "", //训练营结束日期
    showDate: "", //切换日期显示
    backIndex: false, //点击返回返回首页
    statusBarHeight: "", //状态栏高度
    videoHeight: "", //视频高度
    appId: "", //appid
    showAddTeacherCover: false, //显示指引弹窗
    fromPage: '', //页面来源
    userInfo: "" //用户信息
  },

  // 关闭引导私域蒙板
  closeCover() {
    this.setData({
      showAddTeacherCover: false
    })
  },

  // 返回
  back() {
    wx.switchTab({
      url: '/pages/practice/practice',
    })
  },

  // 获取有赞id
  getAppId() {
    getYouZanAppId().then((appId) => {
      this.setData({
        appId,
      })
    })
  },

  // 获取引导私域地址
  getArticileLinkData() {
    getArticileLink({
      traincamp_id: this.data.campId
    }).then((res) => {
      this.setData({
        articileLink: res
      })
    })
  },

  // 添加班主任微信
  toArticleLink() {
    bxPoint('guide_wx', {}, false)
    let link = encodeURIComponent(this.data.articileLink)
    wx.navigateTo({
      url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
    })
  },

  // 跳往课程详情
  toCoursedetail(e) {
    let item = e.currentTarget.dataset.item
    if (item.type === 'video') {
      // 视频课程
      this.playVideo()
      this.setData({
        videoData: {
          src: item.video,
          pic: item.cover
        }
      })
    } else if (item.type === 'kecheng') {
      // 课程
      getCourseData({
        kecheng_id: item.kecheng_id,
      }).then((res) => {
        if (res.id) {
          if (res.kecheng_type === 0) {
            // 直播
            getWxRoomData({
              zhibo_room_id: res.room_id
            }).then(res => {
              wx.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${res.zhibo_room.num}`,
              })
            })
          } else if (res.kecheng_type === 1) {
            // 回看
            getWxRoomData({
              zhibo_room_id: res.room_id
            }).then(res => {
              wx.navigateTo({
                url: `/pages/webViewCommon/webViewCommon?link=${res.zhibo_room.link}`,
              })
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
    } else if (item.type === 'product') {
      // 商品
      getProductInfo({
        product_id: item.product_id,
      }).then((res) => {
        wx.navigateToMiniProgram({
          appId: this.data.appId,
          path: res.product.third_link,
        })
      })
    } else if (item.type === 'url') {
      // url
      let link = encodeURIComponent(item.url)
      wx.navigateTo({
        url: `/subCourse/noAuthWebview/noAuthWebview?link=${link}`,
      })
    }
  },

  // 轮播切换
  changeAdvertisingIndex(e) {
    this.setData({
      advertisingIndex: Number(e.detail.current)
    })
  },

  // 广告位跳转
  toAdvertising(e) {
    let item = e.currentTarget.dataset.item
    // let link = encodeURIComponent(item.link)
    bxPoint("applets_banner", {
      position: 'subCourse/campDetail/campDetail'
    }, false)
    if (item.link_type === 'youzan') {
      wx.navigateToMiniProgram({
        appId: this.data.appId,
        path: link,
      })
    } else {
      wx.navigateTo({
        url: item.link
      })
    }
  },

  // 视频播放
  playVideo() {
    this.setData({
      showCover: false,
      showPlayIcon: false
    })
    this.videoContext.play()
    this.videoContext.requestFullScreen()
  },

  // 进/退全屏
  enterFull(e) {
    if (e.detail.fullscreen === false) {
      this.videoContext.pause()
      this.setData({
        showPlayIcon: true,
        showCover: true
      })
    }
  },

  // 判断是否加入训练营
  isJoinCamp() {
    return new Promise(resolve => {
      getHasJoinCamp({
        traincamp_id: this.data.campId
      }).then(res => {
        this.setData({
          joinDate: res.date
        })
        this.getCampDetailData()
        resolve()
      })
    })
  },

  // 获取训练营详情
  getCampDetailData() {
    getCampDetail({
      traincamp_id: this.data.campId,
      user_id: getLocalStorage(GLOBAL_KEY.userId)
    }).then(res => {
      if (res.discount_price > 0 && res.distribution_ratio > 0) {
        res.sharePrice = (res.discount_price * (res.distribution_ratio / 100)) / 100
      }
      let oneDaySecond = 86400
      let formatType = 'yyyy-MM-dd'
      let startDate = new Date(this.data.joinDate).getTime()
      let nowDate = new Date().getTime()
      let endDateStr = dateAddDays(this.data.joinDate, (res.period - 1) * oneDaySecond, formatType)
      let endDate = new Date(endDateStr).getTime()
      let hasStartCampType = ''
      let todayDate = ''
      let showDate = ''
      if (nowDate < startDate) {
        // 未开营
        hasStartCampType = 1
      } else if (nowDate > endDate) {
        // 已结束
        hasStartCampType = 3
      } else {
        // 开营中
        hasStartCampType = 2
        todayDate = getNowDate('-')
      }
      if (this.data.choosedDay) {
        showDate = dateAddDays(this.data.joinDate, (this.data.choosedDay - 1) * oneDaySecond, formatType)
      } else {
        showDate = hasStartCampType === 1 ? this.data.joinDate : hasStartCampType === 2 ? todayDate : endDateStr
      }
      console.log(res)
      this.setData({
        campData: res,
        endDateStr,
        showDate,
        todayDate,
        hasStartCampType
      })
    })
  },

  // 获取当天课程
  getNowCourse(dayNum) {
    getCurentDayData({
      day_num: dayNum,
      traincamp_id: this.data.campId
    }).then(res => {
      let list = res.content ? JSON.parse(res.content) : []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].type === "kecheng") {
            getCourseData({
              kecheng_id: list[i].kecheng_id
            }).then(res => {
              list[i].duration = simpleDurationSimple(res.duration)
              this.setData({
                courseList: list
              })
            })
          } else if (list[i].type === "video" && this.data.videoData.src === '') {
            this.setData({
              videoData: {
                src: list[i].video,
                pic: list[i].cover,
              }
            })
          }
        }
      }
      this.setData({
        courseList: list
      })
    })
  },

  // 跳转至训练营日期切换
  toChangeDate() {
    let pageLength = getCurrentPages()
    if (pageLength.length > 8) {
      wx.redirectTo({
        url: `/subCourse/campPeriodList/campPeriodList?campId=${this.data.campId}&joinDate=${this.data.joinDate}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/campPeriodList/campPeriodList?campId=${this.data.campId}&joinDate=${this.data.joinDate}`,
      })
    }
  },

  // 获取广告图
  getBanner() {
    let userId = JSON.parse(getLocalStorage(GLOBAL_KEY.userId))
    getFindBanner({
      scene: 15,
      user_id: userId,
      traincamp_id: this.data.campId
    }).then(res => {
      this.setData({
        advertisingList: res || []
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
      showAddTeacherCover: showCover
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let choosedDay = options.dayNum === undefined ? options.dayNum : Number(options.dayNum)
    let fromPage = options.from === undefined ? '' : options.from
    let campId = options.id
    let oneDaySecond = 86400
    let formatType = 'yyyy-MM-dd'
    let {
      scene,
      share,
    } = options
    this.setData({
      campId,
      choosedDay,
      fromPage
    })
    this.getAppId()
    this.getArticileLinkData()
    this.getBanner()
    this.initCoverShow(campId)
    this.isJoinCamp().then(() => {
      let whatDay = computeDate(new Date().getTime(), new Date(this.data.joinDate).getTime())
      if (choosedDay !== undefined && choosedDay !== 0) {
        let endDate = dateAddDays(this.data.joinDate, (choosedDay - 1) * oneDaySecond, formatType).replace(/-/g, '/')
        let endDateNum = new Date(endDate).getTime()
        if (new Date().getTime() < endDateNum) {
          // 当前查看的日期大于当天日期,锁住
          this.setData({
            showLock: true
          })
        }
        this.getNowCourse(choosedDay)
      } else if (choosedDay !== undefined && choosedDay === 0) {
        this.getNowCourse(0)
      } else {
        this.getNowCourse(whatDay)
      }
      let nowDate = new Date().getTime()
      let startDate = new Date(this.data.joinDate).getTime()
      if (nowDate < startDate) {
        this.setData({
          choosedDay: choosedDay === undefined ? 0 : choosedDay
        })
      }
      this.setData({
        whatDay
      })
    })
    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/')
      let [sceneSource = ''] = sceneAry
      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
      this.setData({
        backIndex: true,
      })
    }
    // 分享直接进入的
    if (share) {
      this.setData({
        backIndex: true,
      })
    }
    // 存储用户信息
    this.setData({
      userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    bxPoint('camp_calendar', {
      from_uid: getApp().globalData.super_user_id,
    })
    let height = parseInt(
      ((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth - 114) /
        16) *
      9
    )
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      videoHeight: height,
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
    let shareLink = '/subCourse/joinCamp/joinCamp?id=' +
      this.data.campId +
      `&invite_user_id=${getLocalStorage(GLOBAL_KEY.userId)}&share=true`
    if (this.data.userInfo !== '' && this.data.userInfo.kecheng_user.is_promoter === 1) {
      shareLink += `&promote_uid=${this.data.userInfo.id}`
    }
    return {
      title: `我正在参加${this.data.campData.name}，每天都有看的见的变化，快来试试`,
      path: shareLink
    }
  }
})