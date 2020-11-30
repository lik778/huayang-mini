// subCourse/videoCourse/videoCourse.js
import {
  convertToChinaNum,
  getLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  payCourse,
  secondToMinute,
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import {
  checkFocusLogin
} from "../../api/auth/index"
import {
  checkJoinVideoCourse,
  createFissionTask,
  getVideoArticleLink,
  getVideoCourseDetail,
  joinVideoCourse,
  recordStudy
} from "../../api/course/index"
import {
  GLOBAL_KEY,
  Version
} from "../../lib/config"

const ButtonType = {
  freeAndNoLevelLimit: 1, // 免费且没有等级限制
  freeAndLevelLimit: 2, // 免费且有等级限制
  chargeAndDiscounts: 3, // 收费但有优惠
  originPrice: 4, // 原价出售
  restore: 5, // 恢复练习
  normal: 6, // 正常状态
  thoughIOSVirtualPay: 8, // 过审核iOS虚拟支付
  fissionAndCountLimitAndFreeDiscount: 9, // 营销活动 & 需要助力 & 0折
  fissionAndCountLimitAndDiscountLimit: 10, // 营销活动 & 需要助力 & N折（N>0）
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoStyle: "",
    showVideoLock: false,
    didShowAuth: false, //控制显示授权弹窗
    playIndex: -1, //当前播放视频index
    videoSrc: "", //视频播放地址
    buttonType: 1, //按钮类型
    tabIndex: 0, //tab切换index
    lock: true, //请求接口lock
    videoId: "", //视频课程id
    courseData: '', //视频详情数据
    videoLock: true, //视频锁控制显示
    closeCover: false, //关闭封面图
    showMoreAll: false, //
    showMore: true, //展示课程列表更多
    showVideoCover: true, //是否显示视频播放按钮/封面
    hasLogin: false, //是否登录
    articleLink: '', //引导私域文章地址
    didResetDiscountPrice: false, // 是否重置优惠价格
    promoteUid: "", //分销分享人ID
    userInfo: "", //用户信息
    showPromotion: true, //分销分享按钮
    playDurationsList: [], //播放记录秒数打点
    playDurationsListAll: [], //播放记录所有打点
  },
  initFissionTask() {
    createFissionTask({
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      kecheng_series_id: this.data.courseData.id,
    }).then((fissionData) => {
      wx.navigateTo({
        url: `/subCourse/invitePage/invitePage?series_invite_id=${fissionData.id}&videoId=${this.data.courseData.id}&fissionPrice=${this.data.courseData.fission_price}`
      })
    })
  },
  // 播放
  play(e) {
    if (!hasAccountInfo() ||
      !hasUserInfo()) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    let playIndex = this.data.playIndex === -1 ? 0 : this.data.playIndex
    let index = e.currentTarget.dataset.index
    if (index !== undefined && index !== playIndex) {
      playIndex = index
      this.setData({
        videoSrc: e.currentTarget.dataset.item.url,
        playIndex: playIndex,
        closeCover: true,
        showVideoCover: false
      })
    } else {
      this.setData({
        playIndex: playIndex,
        closeCover: true,
        showVideoCover: false,
        videoSrc: this.data.videoListAll[playIndex].url
      })
    }
    wx.pageScrollTo({
      duration: 100,
      scrollTop: 0
    })
    // 记录学习到第几课
    recordStudy({
      kecheng_series_id: this.data.courseData.id,
      kecheng_num: playIndex + 1
    })
    // 学习课程打点
    bxPoint("series_content_click", {
      series_id: this.data.courseData.id,
      kecheng_title: this.data.videoListAll[playIndex].title
    }, false)
    setTimeout(() => {
      this.videoContext.play()
    }, 200)
  },
  // 播放结束
  endVideo() {
    this.setData({
      playIndex: -1
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
    })
  },

  // 暂停播放
  pause() {
    if (!this.data.closeCover) {
      this.setData({
        showVideoCover: true
      })
    }
  },


  // 记录播放时长打点
  recordPlayDuration() {
    let VideoSrcHost = 'https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com' //视频地址前缀
    let arr = this.data.playDurationsList.sort((a, b) => {
      return a - b
    })
    let time = this.data.courseData.video_detail[this.data.playIndex].duration //视频总时长
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

    bxPoint("page_series", {
      scene: 'page_series',
      kecheng_series_id: this.data.videoId,
      video_src: this.data.videoSrc.split(VideoSrcHost)[1],
      lesson_num: `第${this.data.playIndex + 1}节课`,
      play_duration: {
        time_snippet: timeList.length === 0 ? arr : timeList, //事件片段
        total_duration: time, //视频总时间
        total_visit_duration: arr.length, // 总观看时间
      },
    }, false)
  },

  // 加入课程
  join() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? '' : JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    let openid = getLocalStorage(GLOBAL_KEY.openId) === undefined ? '' : getLocalStorage(GLOBAL_KEY.openId)
    if (userInfo === '') {
      this.setData({
        didShowAuth: true
      })
      return
    } else {
      if (this.data.lock) {
        // 加入课程
        joinVideoCourse({
          open_id: openid,
          series_id: this.data.courseData.id,
          promote_uid: this.data.promoteUid
        }).then(res => {
          this.setData({
            lock: false
          })
          bxPoint("series_join", {
            series_id: this.data.courseData.id
          }, false)
          if (res === 'success') {
            this.backFun({
              type: "success"
            })
          } else if (res.num) {
            payCourse({
              id: res.id,
              name: '加入视频课程'
            }).then(res => {
              // 设置顶部标题
              if (res.errMsg === "requestPayment:ok") {
                this.backFun({
                  type: "success"
                })
              } else {
                this.backFun({
                  type: "fail"
                })
              }
            }).catch(err => {
              this.backFun({
                type: "fail"
              })
            })
          }
        })
      }
    }
  },
  // 集中处理支付回调
  backFun({
    type
  }) {
    if (type === 'fail') {
      this.setData({
        lock: true
      })
      wx.showToast({
        title: '支付失败',
        icon: "none",
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '加入成功',
        icon: "success",
        duration: 2000
      })
      this.checkIsjoined()
    }
  },
  // 获取课程详情
  getVideoDetail(button) {
    getVideoCourseDetail({
      series_id: this.data.videoId,
      user_id: getLocalStorage(GLOBAL_KEY.userId)
    }).then(res => {
      let buttonType = ButtonType.freeAndNoLevelLimit
      let showMore = false
      let showMoreAll = false
      let videoListAll = null
      let lock = true
      let userGrade = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade : 0
      res.detail_pics = res.detail_pics.split(",")
      if (res.discount_price === -1 && res.price > 0) {
        // 原价出售
        buttonType = ButtonType.originPrice
        // 是否有营销活动
        if (+res.invite_open === 1) {
          if (res.invite_count > 0 && +res.invite_discount === 0) {
            // 邀请人数不为0 & 优惠价格为0
            buttonType = ButtonType.fissionAndCountLimitAndFreeDiscount
          } else if (+res.invite_count === 0 && res.invite_discount > 0) {
            // 邀请人数为0 & 优惠价格不为0
            res.discount_price = (+res.price * res.invite_discount / 10000).toFixed(2)
            buttonType = ButtonType.chargeAndDiscounts
            this.setData({
              didResetDiscountPrice: true
            })
          } else if (res.invite_count > 0 && res.invite_discount > 0) {
            // 邀请人数不为0 & 优惠折扣不为0
            res.fission_price = (+res.price * res.invite_discount / 10000).toFixed(2)
            buttonType = ButtonType.fissionAndCountLimitAndDiscountLimit
          } else if (+res.invite_count === 0 && +res.invite_discount === 0) {
            // 邀请人数为0 & 优惠折扣为0
            buttonType = ButtonType.freeAndNoLevelLimit
          }
          res.discountNo = (res.invite_discount / 10)
        }
      } else if (res.discount_price === 0 && res.price > 0) {
        // 免费且没有等级限制
        buttonType = ButtonType.freeAndNoLevelLimit
      } else if (res.discount_price > 0 && res.price > 0) {
        // 收费但有折扣
        buttonType = ButtonType.chargeAndDiscounts
        // 是否有营销活动
        if (+res.invite_open === 1) {
          if (res.invite_count > 0 && +res.invite_discount === 0) {
            // 邀请人数不为0 & 优惠价格为0
            buttonType = ButtonType.fissionAndCountLimitAndFreeDiscount
          } else if (+res.invite_count === 0 && res.invite_discount > 0) {
            // 邀请人数为0 & 优惠价格不为0
            res.discount_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
            buttonType = ButtonType.chargeAndDiscounts
            this.setData({
              didResetDiscountPrice: true
            })
          } else if (res.invite_count > 0 && res.invite_discount > 0) {
            // 邀请人数不为0 & 优惠折扣不为0
            res.fission_price = (+res.discount_price * res.invite_discount / 10000).toFixed(2)
            buttonType = ButtonType.fissionAndCountLimitAndDiscountLimit
          } else if (+res.invite_count === 0 && +res.invite_discount === 0) {
            // 邀请人数为0 & 优惠折扣为0
            buttonType = ButtonType.freeAndNoLevelLimit
          }
          res.discountNo = (res.invite_discount / 10)
        }
      } else if (res.price <= 0) {
        // 免费
        if (res.user_grade > 0 && userGrade < res.user_grade) {
          // 免费但有等级限制
          buttonType = ButtonType.freeAndLevelLimit
        }
      }
      res.price = (res.price / 100).toFixed(2)
      if (!this.data.didResetDiscountPrice) {
        res.discount_price = (res.discount_price / 100).toFixed(2)
      }
      videoListAll = JSON.parse(res.video_detail)
      for (let i in videoListAll) {
        // 处理课程视频长度以及第xx节课
        videoListAll[i].duration = videoListAll[i].time
        videoListAll[i].time = secondToMinute(videoListAll[i].time)
        console.log(videoListAll[i])
        videoListAll[i].Index = convertToChinaNum(parseInt(i) + 1)
      }
      res.video_detail = videoListAll.slice(0, 3)
      if (videoListAll.length > 3) {
        // 显示展开按钮
        showMore = true
        showMoreAll = true
      } else {
        showMoreAll = false
      }
      if (button === 6 || buttonType === 6) {
        // 控制视频是否可以播放
        lock = false
      }
      let canPlay = res.video_detail[0].canReplay
      let showVideoCoverLock = this.data.showVideoCover
      let hasLogin = this.data.hasLogin
      let showVideoLock = false
      if (showVideoCoverLock) {
        let buttonType = button ? button : buttonType
        // 显示遮罩层
        if (buttonType === 1) {
          // 未登录或者免费未加入
          if (hasLogin) {
            if (canPlay) {
              showVideoLock = false
            } else {
              showVideoLock = true
            }
          } else {
            if (canPlay) {
              showVideoLock = false
            } else {
              showVideoLock = true
            }
          }
        } else {
          // 已登陆
          if (hasLogin) {
            if (canPlay) {
              showVideoLock = false
            } else {
              if (buttonType === 6) {
                showVideoLock = false
              } else {
                showVideoLock = true
              }
            }
          } else {
            if (canPlay) {
              showVideoLock = false
            } else {
              showVideoLock = true
            }
          }
        }
      } else {
        showVideoLock = false
      }
      let buttonStyle = button ? button : buttonType
      if (res.discount_price > 0 && res.distribution_ratio > 0) {
        res.sharePrice = ((res.discount_price * (res.distribution_ratio / 100))).toFixed(2)
      } else {
        res.sharePrice = ''
      }
      this.getArticleLink(res.id)
      checkFocusLogin({
        app_version: Version
      }).then(res1 => {
        let _this = this
        if (!res1) {
          // ios规则弹窗
          wx.getSystemInfo({
            success: function (res2) {
              if (res2.platform == 'ios') {
                buttonStyle = ButtonType.thoughIOSVirtualPay
              }
              _this.setData({
                courseData: res,
                showMoreAll: showMoreAll,
                videoListAll: videoListAll,
                showMore: showMore,
                videoLock: lock,
                showVideoLock: showVideoLock,
                buttonType: buttonStyle,
                videoSrc: videoListAll[0].canReplay ? videoListAll[0].url : ''
              })
            }
          })
        } else {
          _this.setData({
            courseData: res,
            showMoreAll: showMoreAll,
            videoListAll: videoListAll,
            showMore: showMore,
            videoLock: lock,
            showVideoLock: showVideoLock,
            buttonType: buttonStyle,
            videoSrc: videoListAll[0].canReplay ? videoListAll[0].url : ''
          })
        }
      })

    })
  },
  // 检查是否已经加入课程
  checkIsjoined() {
    if (hasAccountInfo() &&
      hasUserInfo()) {
      // 已经登录
      this.setData({
        hasLogin: true,
        userInfo: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      })
      checkJoinVideoCourse({
        kecheng_series_id: this.data.videoId
      }).then(res => {
        if (res.code === -2) {
          this.setData({
            showPromotion: false
          })
        }
        if (res.data === null) {
          // 未加入过
          this.getVideoDetail()
        } else {
          // 加入过
          let buttonType = ""
          if (res.data.status === 2) {
            buttonType = ButtonType.restore
          } else {
            buttonType = ButtonType.normal
          }
          this.getVideoDetail(buttonType)
        }
      }).catch(() => {
        this.setData({
          showPromotion: false
        })
      })
    } else {
      // 未登陆
      this.setData({
        hasLogin: false,
        showPromotion: false
      })
      this.getVideoDetail(1)
    }
  },
  // 展开全部
  showMore() {
    let data = this.data.courseData
    if (this.data.showMore) {
      data.video_detail = this.data.videoListAll
    } else {
      data.video_detail = this.data.videoListAll.slice(0, 3)
    }
    this.setData({
      courseData: data,
      showMore: !this.data.showMore
    })
  },
  // 分享打点
  share() {
    bxPoint("series_share", {
      series_id: this.data.courseData.id
    }, false)
  },
  // 授权弹窗取消回调
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
  // 授权弹窗确认回调
  authCompleteEvent() {
    this.checkIsjoined()
    setTimeout(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      this.setData({
        didShowAuth: false,
        userInfo
      })
    }, 200)
  },
  // 目录/详情切换
  changeTabIndex(e) {
    let index = parseInt(e.currentTarget.dataset.index)
    // this.scrollToDetail(index)
    this.setData({
      tabIndex: index
    })
  },
  // 获取视频课程引流文章地址
  getArticleLink(e) {
    getVideoArticleLink({
      series_id: e
    }).then(res => {
      this.setData({
        articleLink: res
      })
    })
  },
  // 点击添加班主任微信
  toLink() {
    let link = this.data.articleLink
    wx.navigateTo({
      url: `/pages/webViewCommon/webViewCommon?link=${link}`,
    })
  },
  // ios规则
  openToast() {
    wx.showModal({
      title: "提示",
      content: "由于相关规范，ios功能暂不可用",
      showCancel: false
    })
  },
  // 滚动至课程详情
  scrollToDetail(e) {
    let query = wx.createSelectorQuery()
    if (e === 0) {
      query.select('#course').boundingClientRect((rect) => {
        wx.pageScrollTo({
          scrollTop: rect.top,
          duration: 100,
        })
      }).exec()
    } else {
      query.select('#course-detail').boundingClientRect((rect) => {
        wx.pageScrollTo({
          scrollTop: rect.top,
          duration: 100,
        })
      }).exec()
    }
  },

  // 分销打点
  shareCourse() {
    bxPoint('promotion_videoCourse_page', {
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      user_id: getLocalStorage(GLOBAL_KEY.userId),
      isPromoter: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).kecheng_user.is_promoter === 1 ? true : false
    }, false)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
      source,
      videoId,
      promote_uid = '',
      series_invite_id = ''
    } = options
    if (promote_uid !== '') {
      this.setData({
        promoteUid: promote_uid
      })
    }
    // 通过小程序码进入 scene=${source}
    if (scene) {
      let sceneAry = decodeURIComponent(scene).split('/');
      let [sceneSource = '', sceneId = 0] = sceneAry;
      if (sceneSource) {
        getApp().globalData.source = sceneSource
      }
      this.setData({
        videoId: sceneId
      })
    } else {
      // 通过卡片进入
      if (source) {
        getApp().globalData.source = source
      }
      this.setData({
        videoId: videoId
      })
    }
    this.checkIsjoined()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    let width = wx.getSystemInfoSync().windowWidth
    let height = parseInt(((width - 30) / 16) * 9)
    this.setData({
      videoStyle: `height:${height}px`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // pv打点
    bxPoint("series_detail", {
      series_id: this.data.videoId,
      source: getApp().globalData.source,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 记录播放时长打点
    this.recordPlayDuration()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 记录播放时长打点
    this.recordPlayDuration()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onPageScroll: function () {

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
    let shareLink = `/subCourse/videoCourse/videoCourse?videoId=${this.data.courseData.id}`
    if (this.data.promoteUid !== '') {
      shareLink += `&promote_uid=${this.data.promoteUid}`
    } else {
      if (this.data.userInfo !== '' && this.data.userInfo.kecheng_user.is_promoter === 1) {
        shareLink += `&promote_uid=${this.data.userInfo.id}`
      }
    }

    return {
      title: this.data.courseData.share_desc,
      path: shareLink
    }
  }
})