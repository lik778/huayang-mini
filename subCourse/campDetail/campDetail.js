// subCourse/trainingCampDetail/trainingCampDetail.js
import {
  getArticileLink,
  getCampDetail,
  getCourseData,
  getCurentDayData,
  getFindBanner,
  getHasJoinCamp,
  getWxRoomData,
  checkNeedToFillInfo,
  studyLogCreate,
  dailyStudyCheck,
  queryPunchCardQrCode,
  getClassLogo,
  getClassStudentData
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
  simpleDurationSimple,
  getNowDateAll
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
      pic: "",
      index: ""
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
    userInfo: "", //用户信息
    promoteUid: "", //分销人id
    period: "", //训练营周期
    playDurationsList: [],
    totalDurantion: 0, //视频总时长
    playIndex: 0, //课程下标
    hasPlayVideo: false,
    createPoint: true, //打点lock
    showShareButton: false, //是否显示分享海报跳转按钮
    dayNum: 0,
    canShowPage: false,
    showMyCredential: false, //是否显示我的结营证书
  },

  // 跳往训练营结营证书页
  toMyCredential() {
    bxPoint("page_camp_detail_credential", {
      traincamp_id: this.data.campData.id
    }, false)
    getClassStudentData({
      user_id: this.data.userInfo.id
    }).then(res1 => {
      let name = res1.data.real_name === '' ? this.data.userInfo.nick_name : res1.data.real_name
      getClassLogo({
        user_id: this.data.userInfo.id,
        traincamp_id: this.data.campId,
        start_date: this.data.joinDate
      }).then(res => {
        let logo = ''
        if (res.data && res.data.class_num !== 0) {
          logo = JSON.parse(res.data.logos)[res.data.class_num]
          logo = logo || ''
        }
        wx.navigateTo({
          url: `/subCourse/campCredential/campCredential?campData=${JSON.stringify(this.data.campData)}&userName=${name}&logo=${logo}`,
        })
      })
    })
  },

  // 跳转至训练营海报页
  toCampPoster() {
    bxPoint("page_traincamp_share_button", {
      traincamp_id: this.data.campData.id,
      date: getNowDateAll('-'),
      day_num: this.data.dayNum
    }, false)
    queryPunchCardQrCode({
      traincamp_id: this.data.campId
    }).then(res => {
      let obj = Object.assign(this.data.campData, {
        day_num: this.data.dayNum
      })
      obj.qrcode = res
      let data = JSON.stringify(obj)
      wx.navigateTo({
        url: `/subCourse/campSharePoster/campSharePoster?data=${data}`,
      })
    })

  },

  // 关闭引导私域蒙板
  closeCover() {
    this.setData({
      showAddTeacherCover: false
    })
  },

  // 返回
  back() {
    wx.reLaunch({
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
    let index = e.currentTarget.dataset.index
    let VideoSrcHost = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com' //视频地址前缀
    this.setData({
      playIndex: index
    })
    if (item.type === 'video') {
      // 视频课程
      this.playVideo()
      this.setData({
        videoData: {
          src: item.video,
          pic: item.cover,
          index: index
        }
      })
    } else if (item.type === 'kecheng') {
      // 课程
      if (this.data.hasStartCampType !== 1) {
        // 学历数据记录
        let params = {
          user_id: this.data.userInfo.id,
          traincamp_id: this.data.campId,
          start_date: this.data.joinDate,
          date: this.data.showDate
        }
        if (this.data.createPoint) {
          this.setData({
            createPoint: false
          })
          studyLogCreate(params).then(res => {
            setTimeout(() => {
              this.setData({
                createPoint: true
              })
            }, 1000)
          }).catch(() => {
            setTimeout(() => {
              this.setData({
                createPoint: true
              })
            }, 1000)
          })
        }
      }

      getCourseData({
        kecheng_id: item.kecheng_id,
      }).then((res) => {
        if (res.id) {
          if (res.kecheng_type === 0) {

            // 直播
            bxPoint('traincamp_every_day', {
              videoSrc: this.data.videoData.src.split(VideoSrcHost)[1],
              is_course: true,
              lesson_num: `第${this.data.videoData.index+1}节课`,
              traincamp_id: this.data.campId
            }, false)

            getWxRoomData({
              zhibo_room_id: res.room_id
            }).then(res => {
              wx.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${res.zhibo_room.num}`,
              })
            })
          } else if (res.kecheng_type === 1) {
            // 回看


            bxPoint('traincamp_every_day', {
              videoSrc: this.data.videoData.src.split(VideoSrcHost)[1],
              lesson_num: `第${this.data.videoData.index+1}节课`,
              is_course: true,
              traincamp_id: this.data.campId
            }, false)
            getWxRoomData({
              zhibo_room_id: res.room_id
            }).then(res => {
              wx.navigateTo({
                url: `/pages/webViewCommon/webViewCommon?link=${res.zhibo_room.link}`,
              })
            })
          } else if (res.kecheng_type === 2) {
            // 小额通

            bxPoint('traincamp_every_day', {
              lesson_num: `第${this.data.videoData.index+1}节课`,
              is_course: false,
              traincamp_id: this.data.campId
            }, false)
            wx.navigateTo({
              url: `/pages/webViewCommon/webViewCommon?link=${res.xiaoetong_url}`,
            })
          } else {
            // 结构化


            bxPoint('traincamp_every_day', {
              videoSrc: this.data.videoData.src.split(VideoSrcHost)[1],
              lesson_num: `第${this.data.videoData.index+1}节课`,
              is_course: true,
              traincamp_id: this.data.campId
            }, false)
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
      bxPoint('traincamp_every_day', {
        lesson_num: `第${this.data.videoData.index+1}节课`,
        is_course: false,
        traincamp_id: this.data.campId
      }, false)

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
      bxPoint('traincamp_every_day', {
        is_course: false,
        traincamp_id: this.data.campId,
        lesson_num: `第${this.data.videoData.index+1}节课`,
      }, false)
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
      position: 'subCourse/campDetail/campDetail',
      bannerId: item.id || ""
    }, false)
    if (item.link_type === 'youzan') {
      wx.navigateToMiniProgram({
        appId: this.data.appId,
        path: item.link,
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
      showPlayIcon: false,
      hasPlayVideo: true
    })
    let params = {
      user_id: this.data.userInfo.id,
      traincamp_id: this.data.campId,
      start_date: this.data.joinDate,
      date: this.data.showDate
    }
    if (this.data.createPoint) {
      this.setData({
        createPoint: false
      })
      studyLogCreate(params).then(res => {
        setTimeout(() => {
          this.setData({
            createPoint: true
          })
        }, 1000)
      }).catch(() => {
        setTimeout(() => {
          this.setData({
            createPoint: true
          })
        }, 1000)
      })
    }
    let VideoSrcHost = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com' //视频地址前缀
    bxPoint('traincamp_every_day', {
      videoSrc: this.data.videoData.src.split(VideoSrcHost)[1],
      traincamp_id: this.data.campId,
      is_course: true,
      lesson_num: `第${this.data.videoData.index+1}节课`,
    }, false)
    this.videoContext.play()
    this.videoContext.requestFullScreen()
  },

  // 分销打点
  shareCamp() {
    bxPoint('promotion_camp_detailpage', {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      isPromoter: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).kecheng_user.is_promoter === 1 ? true : false
    }, false)
  },

  // 进/退全屏
  enterFull(e) {
    if (e.detail.fullscreen === false) {
      this.videoContext.pause()
      if (this.data.dayNum !== 0) {
        dailyStudyCheck({
          user_id: this.data.userInfo.id,
          traincamp_id: this.data.campId,
          start_date: this.data.joinDate,
          date: this.data.showDate
        }).then(res => {
          if (res.data) {
            this.setData({
              showShareButton: true
            })
          } else {
            this.setData({
              showShareButton: false
            })
          }
        })
      } else {
        this.setData({
          showShareButton: false
        })
      }
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
          joinDate: res.date,
          period: res.period
        })
        this.getCampDetailData().then(() => {
          resolve()
        })
      })
    })
  },

  // 获取训练营详情
  getCampDetailData() {
    return new Promise(resolve => {
      getCampDetail({
        traincamp_id: this.data.campId,
        user_id: getLocalStorage(GLOBAL_KEY.userId)
      }).then(res => {
        if (res.discount_price > 0 && res.distribution_ratio > 0) {
          res.sharePrice = ((res.discount_price * (res.distribution_ratio / 100)) / 100).toFixed(2)
        } else {
          res.sharePrice = ''
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
        // 处理日期补0
        let dateStr = showDate.split("-")
        for (let i in dateStr) {
          if (Number(dateStr[i]) < 10 && dateStr[i].indexOf("0") !== 0) {
            dateStr[i] = "0" + dateStr[i]
          }
        }
        showDate = dateStr.join("-")
        this.setData({
          campData: res,
          endDateStr,
          showDate,
          todayDate,
          hasStartCampType
        })
        resolve()
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
      if (dayNum !== 0) {
        dailyStudyCheck({
          user_id: this.data.userInfo.id,
          traincamp_id: this.data.campId,
          start_date: this.data.joinDate,
          date: this.data.showDate
        }).then(res => {
          if (res.data) {
            this.setData({
              showShareButton: true
            })
          } else {
            this.setData({
              showShareButton: false
            })
          }
        })
      } else {
        this.setData({
          showShareButton: false
        })
      }
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].type === "kecheng") {
            getCourseData({
              kecheng_id: list[i].kecheng_id
            }).then(res => {
              list[i].duration = simpleDurationSimple(res.duration)
              this.setData({
                courseList: list,
                canShowPage: true
              })
            })
          } else if (list[i].type === "video" && this.data.videoData.src === '') {
            this.setData({
              videoData: {
                src: list[i].video,
                pic: list[i].cover,
                index: i
              },
              courseList: list,
              canShowPage: true
            })
          } else {
            this.setData({
              canShowPage: true,
              courseList: list,
            })
          }
        }
      } else {
        this.setData({
          canShowPage: true
        })
      }
      this.setData({
        dayNum: dayNum,
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

  // 检查是否需要填写信息
  checkNeedFillInfo() {
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    return new Promise(resolve => {
      checkNeedToFillInfo({
        user_id: userId
      }).then(res => {
        if (res.data) {
          wx.navigateTo({
            url: `/subCourse/applyJoinSchool/applyJoinSchool?campId=${this.data.campId}`,
          })
        }
      })
    })

  },

  // 播放进度变化
  processChange(e) {
    let arr = this.data.playDurationsList
    let time = Math.floor(e.detail.currentTime)
    if (this.data.playDurationsList.indexOf(time) === -1) {
      arr.push(time)
    }
    this.setData({
      playDurationsList: arr,
      totalDurantion: Math.floor(e.detail.duration)
    })
  },

  // 记录播放时长打点
  recordPlayDuration() {
    if (!this.data.hasPlayVideo) return
    let VideoSrcHost = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com' //视频地址前缀
    let arr = this.data.playDurationsList.sort((a, b) => {
      return a - b
    })
    let time = this.data.totalDurantion //视频总时长
    let splitIndexArr = []
    let index = 0
    let timeSnippetArr = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1] - arr[i] > 1) {
        splitIndexArr.push(i + 1)
      }
    }
    while (splitIndexArr.length > 0) {
      let data = arr.slice(index, splitIndexArr[0])
      timeSnippetArr.push(data)
      index = splitIndexArr[0]
      splitIndexArr.splice(0, 1)
      if (splitIndexArr.length === 0) {
        timeSnippetArr.push(arr.slice(index, arr.length))
      }
    }
    let timeList = []
    for (let i in timeSnippetArr) {
      let str1 = timeSnippetArr[i][0]
      let str2 = timeSnippetArr[i][timeSnippetArr[i].length - 1]
      timeList.push(`${str1}-${str2}`)
    }
    let listData = []
    if (arr.length <= 1) {
      listData = arr[0]
    } else {
      listData = [`${arr[0]}-${arr[arr.length-1]}`]
    }
    bxPoint("page_traincamp", {
      scene: 'page_traincamp',
      traincamp_id: this.data.campId,
      video_src: this.data.videoData.src.split(VideoSrcHost)[1],
      lesson_num: `第${this.data.playIndex + 1}节课`,
      kecheng_title: `${this.data.courseList[this.data.playIndex].name}`,
      play_duration: {
        time_snippet: timeList.length === 0 ? listData : timeList, //事件片段
        total_duration: time, //视频总时间
        total_visit_duration: arr.length, // 总观看时间
      },
    }, false)
  },

  // 检查是否需要替换按钮为我的结营证书
  checkNeedShowMyCredential() {
    let period = (this.data.campData.period - 1) * 24 * 60 * 60
    let joinDate = this.data.joinDate
    let endDate = dateAddDays(joinDate, period, 'yyyy-MM-dd')
    if (new Date().getTime() >= new Date(endDate).getTime()) {
      this.setData({
        showMyCredential: true
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let choosedDay = options.dayNum === undefined ? options.dayNum : Number(options.dayNum)
    let fromPage = options.from === undefined ? '' : options.from
    let campId = options.id

    let {
      scene,
      share,
      promote_uid = "",
    } = options
    // 设置邀请人id
    if (promote_uid !== '') {
      this.setData({
        promoteUid: promote_uid
      })
    }
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
    this.setData({
      campId,
      choosedDay,
      fromPage
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
      bootcampId: this.data.campId
    })
    // 初始化数据
    let run = () => {
      let oneDaySecond = 86400
      let formatType = 'yyyy-MM-dd'
      this.getAppId()
      this.getArticileLinkData()
      this.getBanner()
      this.initCoverShow(this.data.campId)
      this.isJoinCamp().then(() => {
        let whatDay = computeDate(new Date().getTime(), new Date(this.data.joinDate).getTime())
        let nowDate = new Date().getTime()
        let startDate = new Date(this.data.joinDate).getTime()
        if (this.data.choosedDay !== undefined && this.data.choosedDay !== 0) {
          let endDate = dateAddDays(this.data.joinDate, (this.data.choosedDay - 1) * oneDaySecond, formatType).replace(/-/g, '/')
          let endDateNum = new Date(endDate).getTime()
          if (new Date().getTime() < endDateNum) {
            // 当前查看的日期大于当天日期,锁住
            this.setData({
              showLock: true
            })
          }
          this.getNowCourse(this.data.choosedDay)
        } else if (this.data.choosedDay !== undefined && this.data.choosedDay === 0) {
          this.getNowCourse(0)
        } else {
          let oneDaySecond = 86400
          let formatType = 'yyyy-MM-dd'
          let endDateStr = dateAddDays(this.data.joinDate, (this.data.period - 1) * oneDaySecond, formatType)
          let endDate = new Date(endDateStr).getTime()
          if (nowDate > endDate) {
            this.getNowCourse(this.data.period)
          } else {
            this.getNowCourse(whatDay)
          }
        }

        if (nowDate < startDate) {
          this.setData({
            choosedDay: this.data.choosedDay === undefined ? 0 : this.data.choosedDay
          })
        }
        // 判断是否显示“我的结营证书”
        this.checkNeedShowMyCredential()

        this.setData({
          whatDay
        })
      })

      // 存储用户信息
      this.setData({
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      })
      // 检查是否需要填写学员信息
      this.checkNeedFillInfo()
    }
    run()

    let height = parseInt(((JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth - 114) / 16) * 9)
    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      videoHeight: height,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.recordPlayDuration()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.recordPlayDuration()
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
    if (this.data.promoteUid !== '') {
      shareLink += `&promote_uid=${this.data.promoteUid}`
    } else {
      if (this.data.userInfo !== '' && this.data.userInfo.kecheng_user.is_promoter === 1) {
        shareLink += `&promote_uid=${this.data.userInfo.id}`
      }
    }
    return {
      title: `我正在参加${this.data.campData.name}，每天都有看的见的变化，快来试试`,
      path: shareLink
    }
  }
})