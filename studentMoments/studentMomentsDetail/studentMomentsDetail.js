// studentMoments/studentMomentsDetail/studentMomentsDetail.js
import {
  queryQualityVideoList
} from "../../api/live/index"
import {
  getStudentMomentDetail,
  publishComment
} from "../../api/studentComments/index"
import {
  store
} from '../../store/index'
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  getLocalStorage,
  isIphoneXRSMax,
  createLocalCommentItem
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonIcon: {
      likeIcon: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367647LTWDYU.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367660dslOOQ.jpg'],
      commentIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367678kxmCLk.jpg',
      playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618535781FCwFCm.jpg',
      shareIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367691MgBtuD.jpg'
    },
    likeIcon: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367647LTWDYU.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618367660dslOOQ.jpg'], //点赞icon
    swiperData: {
      autoplay: true,
      indicatorDots: true,
      interval: 4000,
      circular: true,
      duration: 300,
      current: 0
    },
    detailData: '', //动态详情
    id: "", //动态id
    inInputComment: false, //评论输入框是否聚焦中
    commentPageData: {
      offset: 0,
      limit: 3,
      bubble_id: ''
    }, //评论参数
    commentList: [], //评论列表
    noCommentData: false, //是否还有下一页评论(false展示下一页按钮)
    userId: '',
    commentInputValue: '', //评论输入框内容
    userInfo: '',
    nowBarrageTextNum: 0,
    requestMomentStatus: false,
    isIphoneXRSMax: isIphoneXRSMax(),
    showStudentMomentLike: false, //显示点赞动画
    likeLock: true, //点赞锁
    publishCommentLock: true, //发布评论锁
    didShowAuth: false, //显示授权
    courseList: '', //精品课程列表
    inPlayVideo: false, //是否在播放视频
    showPublishComment: false,
    changeAnimationClass: true,
    authType: '', //0是点赞授权，1是评论授权，控制授完权的自动请求数据操作
  },

  // swiper下标更改
  changeSwiperCurrent(e) {
    this.setData({
      ['swiperData.current']: Number(e.detail.current)
    })
  },

  bindfocusDialog(e) {
    console.log(e)
    this.setData({
      reasonHeight: e.detail.height || 0
    })
  },

  bindblurDialog() {
    this.setData({
      reasonHeight: 0
    })
  },

  // 显示评论弹窗
  showCommentBox() {
    // 评论打点-4.19.JJ
    bxPoint("bbs_detail_comment_box", {
      message_id: this.data.id
    })
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true,
        authType: 1
      })
      return
    }
    this.setData({
      showPublishComment: true
    })
  },

  closePublishComment() {
    this.setData({
      changeAnimationClass: false
    })
    setTimeout(() => {
      this.setData({
        showPublishComment: false,
        changeAnimationClass: true
      })
    }, 300)
  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false,
      authType: ''
    })
  },

  // 确认授权
  authCompleteEvent() {
    this.initUserInfo()
    this.setData({
      didShowAuth: false
    })
    this.getDetailData()
    if (this.data.authType === 0) {
      this.likeTap()
    } else if (this.data.authType === 1) {
      this.showCommentBox()
    }
  },

  // 播放视频
  playVideo() {
    this.setData({
      inPlayVideo: true
    })
    setTimeout(() => {
      this.videoContext.play()
    }, 350)
  },

  // 初始化用户信息
  initUserInfo() {
    let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
    let userId = getLocalStorage(GLOBAL_KEY.userId)
    userInfo = userInfo ? JSON.parse(userInfo) : ''
    userId = userId ? userId : ''
    this.setData({
      userInfo,
      userId
    })
  },

  // 查看更多评论
  visitMoreComment() {
    this.setData({
      ['commentPageData.offset']: this.data.commentPageData.offset === 0 ? 3 : this.data.commentPageData.offset + 5,
      ['commentPageData.limit']: 5,
      requestMomentStatus: true
    })
    // 查看更多评论
    bxPoint("bbs_detail_comment_more", {
      message_id: this.data.id
    })
    this.getCommentMsg(true)
  },

  // 点赞
  likeTap() {
    // 授权判断
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true,
        authType: 0
      })
      return
    }
    // 点赞打点-4.19.JJ
    bxPoint('bbs_detail_like', {
      message_id: this.data.id
    })
    // 处理延时点赞
    let item = this.data.detailData
    let {
      hasLike,
      likeCount
    } = item
    let nowHasLike = ''
    let nowLikeCount = ''
    if (hasLike === 1) {
      nowHasLike = 0
      nowLikeCount = likeCount - 1
    } else {
      nowHasLike = 1
      nowLikeCount = likeCount + 1
      this.setData({
        showStudentMomentLike: true
      })
      setTimeout(() => {
        this.setData({
          showStudentMomentLike: false
        })
      }, 1500)
    }
    if (this.data.studentMoments.length) {
      this.updateMomentsLikeStatus({
        id: item.bubble.id,
        hasLike: nowHasLike,
        likeCount: nowLikeCount
      })
    }
    this.setData({
      ['detailData.likeCount']: nowLikeCount,
      ['detailData.hasLike']: nowHasLike,
    })
    this.like({
      hasLike,
      id: item.bubble.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.showCommentBox) {
      this.setData({
        showPublishComment: true
      })
    }
    this.initData(options)
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
    this.videoContext = wx.createVideoContext('myVideo')
    this.pagePvPoint()
  },

  // pv打点-4.19.JJ
  pagePvPoint() {
    bxPoint('bbs_detail_visit')
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
    // 分享打点-4.19.JJ
    bxPoint("bbs_detail_share", {
      message_id: this.data.id
    })
    return {
      title: "快来看看花样大学精彩的校友动态！",
      path: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${this.data.id}`,
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618803112KiZxTl.jpg"
    }
  },


  // 显示大图预览
  showBigImage(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.detailData.bubble.pics,
      current: this.data.detailData.bubble.pics[index]
    })
  },

  // 获取详情信息
  getDetailData() {
    getStudentMomentDetail({
      bubble_id: this.data.id,
      user_id: this.data.userId
    }).then(({
      data
    }) => {
      if (data === undefined) {
        wx.showModal({
          title: "提示",
          content: "该动态已删除",
          confirmText: "查看更多",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              if (this.data.studentMoments.length) {
                this.deleteStudentMoment(this.data.id)
              }
              wx.switchTab({
                url: '/pages/studentMoments/studentMoments',
              })
            }
          }
        })
        return
      }
      this.updateMomentList(data)
      data.bubble.pics = data.bubble.content_type === 1 ? data.bubble.pics.split(',') : ''
      data.hasLike = data.has_like
      data.likeCount = data.bubble.like_count
      if (data.travel_product) {
        data.travel_product.logo_pic = data.travel_product.pics.split(',')[0]
      } else if (data.kecheng_offline) {
        data.kecheng_offline.logo_pic = data.kecheng_offline.cover_pic.split(',')[0]
      }
      if (data.bubble.relate_type === 0) {
        this.getCourseList()
      }
      this.getCommentMsg()
      this.setData({
        detailData: data
      })
    }).catch(() => {
      wx.showModal({
        title: "提示",
        content: "该动态已删除",
        confirmText: "查看更多",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            if (this.data.studentMoments.length) {
              this.deleteStudentMoment(this.data.id)
            }
            wx.switchTab({
              url: '/pages/studentMoments/studentMoments',
            })
          }
        }
      })
    })
  },

  // 课程点击跳转
  toCourseDetail(e) {
    let item = e.currentTarget.dataset.item
    let index = Number(e.currentTarget.dataset.index)
    if (index === 0) {
      // 线上课程
      bxPoint("bbs_detail_series_list", {
        message_id: this.data.id,
        series_id: item.id
      })
      wx.navigateTo({
        url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`,
      })
    } else if (index === 1) {
      // 线下课程
      bxPoint("bbs_detail_series_list", {
        message_id: this.data.id,
        series_offline_id: item.id
      })
      wx.navigateTo({
        url: `/subCourse/offlineCourseDetail/offlineCourseDetail?id=${item.id}`,
      })
    } else if (index === 2) {
      //活动
      bxPoint("bbs_detail_series_list", {
        message_id: this.data.id,
        activities_id: item.id
      })
      wx.navigateTo({
        url: `/pages/activePlatform/activePlatform?link=${encodeURIComponent(`https://huayang.baixing.com/#/home/detail/${item.id}`)}`,
      })
    } else if (index === 3) {
      // 游学
      bxPoint("bbs_detail_series_list", {
        message_id: this.data.id,
        travel_series_id: item.id
      })
      wx.navigateToMiniProgram({
        appId: "wx2ea757d51abc1f47",
        path: '/pages/index/index',
      })
    } else if (index === 4) {
      // 精品课
      bxPoint("bbs_detail_series_list", {
        message_id: this.data.id,
        series_id: item.id
      })
      wx.navigateTo({
        url: `/subCourse/videoCourse/videoCourse?videoId=${item.kecheng_series.id}`,
      })
    }
  },


  // 获取精品课程信息
  getCourseList() {
    queryQualityVideoList({
      limit: 3
    }).then(res => {
      this.setData({
        courseList: res || []
      })
    })
  },

  // 实时更改评论输入框内容
  updateTextareaText(e) {
    let value = e.detail.value
    value = value.substring(0, 200);
    this.setData({
      commentInputValue: value,
      nowBarrageTextNum: value.length
    })
  },

  // 发布评论
  createComment() {
    // 发布评论打点-4.19.JJ
    bxPoint("bbs_detail_comment_publish", {
      message_id: this.data.id
    })
    if (this.data.commentInputValue.trim() === '') {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      })
      return
    }
    if (this.data.publishCommentLock) {
      this.setData({
        publishCommentLock: false,
        inInputComment: false,
        showPublishComment: false,
        changeAnimationClass: true,
      })
      publishComment({
        bubble_id: this.data.id,
        user_id: this.data.userId,
        content: this.data.commentInputValue
      }).then(res => {
        if (res.code === 0) {
          // 生成本地评论
          let itemData = createLocalCommentItem(this.data.commentInputValue, this.data.id)
          let list = this.data.commentList.concat([])
          list.unshift(itemData)
          this.setData({
            commentInputValue: '',
            ['detailData.bubble.comment_count']: this.data.detailData.bubble.comment_count + 1,

            commentList: list
          })
          if (this.data.studentMoments.length > 0) {
            this.updateMomentsCommentCount(Number(this.data.id))
          }
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          })
          this.setData({
            publishCommentLock: true
          })
        } else {
          this.setData({
            publishCommentLock: true
          })
        }
      }).catch(() => {
        this.setData({
          publishCommentLock: true
        })
      })
    }

  },

  initData(e) {
    this.setData({
      id: e.id,
      ['commentPageData.bubble_id']: e.id
    })
    this.initUserInfo()
    this.getDetailData()
    //mobx初始化
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['studentMomentComments', 'studentMoments', ],
      actions: ['getMomentComment', 'updateMomentsCommentCount', 'deleteStudentMoment', 'updateMomentsLikeStatus', 'like', 'updateMomentList'],
    })

  },

  // 获取评论信息
  getCommentMsg(type) {
    this.getMomentComment({
      data: this.data.commentPageData,
      type
    }).then(res => {
      if (res.data.length < this.data.detailData.bubble.comment_count) {
        this.setData({
          noCommentData: false
        })
      } else {
        this.setData({
          noCommentData: true
        })
      }
      this.setData({
        commentList: res.data,
        requestMomentStatus: false
      })
    })
  },

  // 评论框焦点离开
  inputLeave() {
    this.setData({
      inInputComment: false,
      commentInputValue: ''
    })
  }
})