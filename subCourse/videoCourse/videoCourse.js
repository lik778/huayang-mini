// subCourse/videoCourse/videoCourse.js
import {
  getLocalStorage,
  setLocalStorage,
  hasAccountInfo,
  hasUserInfo,
  payCourse,
  convertToChinaNum,
  secondToMinute,
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
import {
  checkJoinVideoCourse,
  getVideoCourseDetail,
  joinVideoCourse,
  recordStudy,
  getVideoArticleLink
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowAuth: false, //控制显示授权弹窗
    playIndex: -1, //当前播放视频index
    didShowAlert: false, //控制显示等级不够弹窗
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
    articleLink: '' //引导私域文章地址
  },
  // 等级不够关闭弹窗
  openBox() {
    this.setData({
      didShowAlert: !this.data.didShowAlert
    })
  },
  // 等级不够完成任务跳往任务页
  goToTask() {
    wx.switchTab({
      url: '/pages/userCenter/userCenter',
    })
  },
  // 播放
  play(e) {
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
  // 暂停播放
  pause() {
    if (!this.data.closeCover) {
      this.setData({
        showVideoCover: true
      })
    }
  },
  // 加入课程
  join() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo) === undefined ? '' : JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    let openid = getLocalStorage(GLOBAL_KEY.openId) === undefined ? '' : openid
    if (userInfo === '') {
      this.setData({
        didShowAuth: true
      })
      return
    } else if (userInfo && userInfo.user_grade < this.data.courseData.user_grade) {
      this.setData({
        didShowAlert: true
      })
    } else {
      if (this.data.lock) {
        // 加入课程
        joinVideoCourse({
          open_id: openid,
          series_id: this.data.courseData.id
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
      series_id: this.data.videoId
    }).then(res => {
      let buttonType = 1
      let showMore = false
      let showMoreAll = false
      let videoListAll = null
      let lock = true
      let userGrade = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).user_grade : 0
      res.detail_pics = res.detail_pics.split(",")
      if (res.discount_price === -1 && res.price > 0) {
        // 原价出售
        buttonType = 4
      } else if (res.discount_price === 0 && res.price > 0) {
        // 免费且没有等级限制
        buttonType = 1
      } else if (res.discount_price > 0 && res.price > 0) {
        // 收费但有折扣
        buttonType = 3
      } else if (res.price <= 0) {
        // 免费
        if (res.user_grade > 0 && userGrade < res.user_grade) {
          // 免费但有等级限制
          buttonType = 2
        }
      }
      res.price = (res.price / 100).toFixed(2)
      res.discount_price = (res.discount_price / 100).toFixed(2)
      videoListAll = JSON.parse(res.video_detail)
      for (let i in videoListAll) {
        // 处理课程视频长度以及第xx节课
        videoListAll[i].time = secondToMinute(videoListAll[i].time)
        // videoListAll[i].time = simpleDurationDate(videoListAll[i].time, 's')
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
      this.getArticleLink(res.id)
      this.setData({
        courseData: res,
        showMoreAll: showMoreAll,
        videoListAll: videoListAll,
        showMore: showMore,
        videoLock: lock,
        buttonType: button ? button : buttonType,
        videoSrc: videoListAll[0].canReplay ? videoListAll[0].url : ''
      })
    })
  },
  // 检查是否已经加入课程
  checkIsjoined() {
    if (hasAccountInfo() &&
      hasUserInfo()) {
      // 已经登录
      this.setData({
        hasLogin: true
      })
      checkJoinVideoCourse({
        kecheng_series_id: this.data.videoId
      }).then(res => {
        if (res === null) {
          // 未加入过
          this.getVideoDetail()
        } else {
          // 加入过
          let buttonType = ""
          if (res.status === 2) {
            buttonType = 5
          } else {
            buttonType = 6
          }
          this.getVideoDetail(buttonType)
        }
      })
    } else {
      // 未登陆
      this.setData({
        hasLogin: false
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
      this.setData({
        didShowAuth: false,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      videoId: options.videoId
    })
    // pv打点
    bxPoint("series_detail", {
      series_id: options.videoId
    })
    this.checkIsjoined()
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
    return {
      title: this.data.courseData.share_desc,
      path: `/subCourse/videoCourse/videoCourse?videoId=${this.data.courseData.id}`
    }
  }
})