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
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  flow
} from "mobx-miniprogram"
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
    showStudentMomentLike: false, //显示点赞动画
    likeLock: true, //点赞锁
    didShowAuth: false, //显示授权
    courseList: '', //精品课程列表
    inPlayVideo: false, //是否在播放视频
  },

  // swiper下标更改
  changeSwiperCurrent(e) {
    this.setData({
      ['swiperData.current']: Number(e.detail.current)
    })
  },

  // 取消授权
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  // 确认授权
  authCompleteEvent() {
    this.initUserInfo()
    this.setData({
      didShowAuth: false
    })
  },

  // 播放视频
  playVideo() {
    this.setData({
      inPlayVideo: true
    })
    setTimeout(() => {
      this.videoContext.play()
    }, 500)
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
      ['commentPageData.offset']: this.data.commentPageData.offset + 5,
      ['commentPageData.limit']: 5
    })
    this.getCommentMsg(true)
  },

  // 点赞
  likeTap() {
    // 授权判断
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true
      })
      return
    }
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
    return {
      title: "快来看看花样大学精彩的校友动态！",
      path: `/studentMoments/studentMomentsDetail/studentMomentsDetail?id=${this.data.id}`
    }
  },

  // 获取详情信息
  getDetailData() {
    getStudentMomentDetail({
      bubble_id: this.data.id,
      user_id: this.data.userId
    }).then(({
      data
    }) => {
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
    })
  },

  // 课程点击跳转
  toCourseDetail(e) {
    let item = e.currentTarget.dataset.item
    let index = Number(e.currentTarget.dataset.index)
    if (index === 0) {
      // 线上课程
      wx.navigateTo({
        url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`,
      })
    } else if (index === 1) {
      // 线下课程

    } else if (index === 2) {
      //活动

    } else if (index === 3) {
      // 游学
      wx.navigateToMiniProgram({
        appId: "wx2ea757d51abc1f47",
        path: '/pages/index/index',
      })

    } else if (index === 4) {
      // 精品课
    }
    console.log(e)
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
  changeCommentText(e) {
    let value = e.detail.value
    this.setData({
      commentInputValue: value
    })
  },

  // 发布评论
  publishComment() {
    if (this.data.commentInputValue.trim() === '') {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      })
      setTimeout(() => {
        this.inputNow()
      }, 20)
      return
    }
    publishComment({
      bubble_id: this.data.id,
      user_id: this.data.userId,
      content: this.data.commentInputValue
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          inInputComment: false,
          commentInputValue: '',
          ['detailData.bubble.comment_count']: this.data.detailData.bubble.comment_count + 1
        })
        this.getCommentMsg()
        if (this.data.studentMoments.length > 0) {
          this.updateMomentsCommentCount(Number(this.data.id))
        }
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
      }
    })
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
      actions: ['getMomentComment', 'updateMomentsCommentCount', 'updateMomentsLikeStatus', 'like'],
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
      })
    })
  },

  // 评论框焦点获取
  inputNow() {
    if (!this.data.userInfo) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    wx.pageScrollTo({
      scrollTop: 200
    })
    this.setData({
      inInputComment: true,
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