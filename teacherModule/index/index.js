// teacherModule/index/index.js
import {
  getTeacherNewInfo,
  getTeacherNewHonorList,
  getTeacherNewMomentList,
  getTeacherNewCommentList,
  publishTeacherNewComment,
  likeTeacherNew,
  likeTeacherNewComment,
  getTeacherNewMedalList
} from "../../api/teacherModule/index"
import {
  getFindBanner,
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639018163AAXOrg.jpg",
    likeIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538156QZXmPX.jpg",
    unLikeIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538135qpLqha.jpg',
    visitIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538173rMsMan.jpg",
    girlIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538201xdkMWA.jpg",
    boyIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538413HLQLzn.jpg',
    rightArrowIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538221DoDrbl.jpg",
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    defaultHeadIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1640571997EfDxwM.jpg',
    currentBannerIndex: 0,
    userInfo: '',
    bottomBannerList: [],
    honorList: [], //荣誉列表
    momentList: [], //动态列表
    teacherMainInfo: "", //老师信息（基础+必要）
    teacherId: '',
    commentInputValue: "", //留言框内容
    commentPublishLock: false, //发布留言锁
    didShowAuth: false, //授权弹窗
    hasAuth: false, //是否授完权
    showControls: false, //显示动态
    teacherLikeLock: false, //点赞老师锁
    medalTotal: 0, //勋章总数
    medalList: [], //勋章列表
    statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
    backPath: "/pages/discovery/discovery"
  },

  /* 点击Banner */
  handleBannerTap() {
    let data = this.data.bottomBannerList[0]
    let {
      link,
      link_type,
      id
    } = data
    bxPoint('teacher_banner_click', {
      teacher_id: this.data.teacherId
    }, false)
    this.naviMiniProgram(link, link_type)
  },

  naviMiniProgram(link, linkType) {
    switch (linkType) {
      case "youzan": {
        // 有赞商城
        wx.navigateToMiniProgram({
          appId: "wx95fb6b5dbe8739b7",
          path: link
        })
        break
      }
      case "travel": {
        // 游学
        wx.navigateToMiniProgram({
          appId: "wx2ea757d51abc1f47",
          path: link
        })
        break
      }
      default: {
        wx.navigateTo({
          url: link,
          fail() {
            wx.switchTab({
              url: link
            })
          }
        })
      }
    }
  },

  /* 给评论点赞 */
  likeComment(e) {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    let item = e.currentTarget.dataset.item
    likeTeacherNewComment({
      comment_id: item.id
    }).then(res => {
      this.getCommentList()
      if (item.has_like) {
        wx.showToast({
          title: '已取消点赞',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      } else {
        wx.showToast({
          title: '点赞成功',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })
  },

  /* 给老师点赞 */
  likeTeacher() {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    bxPoint('teacher_detail_like', {
      teacher_id: this.data.teacherId
    }, false)
    if (!this.data.teacherLikeLock) {
      this.setData({
        teacherLikeLock: true
      })
      likeTeacherNew({
        tutor_id: this.data.teacherId
      }).then(() => {
        wx.showToast({
          title: '点赞成功',
          icon: 'none'
        })
        this.getDetail()
        setTimeout(() => {
          this.setData({
            teacherLikeLock: false
          })
        }, 2000)
      }).catch(() => {
        this.setData({
          teacherLikeLock: false
        })
      })
    }

  },

  /* 取消授权 */
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },

  /* 确认授权 */
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
      hasAuth: true,
    }, () => {
      this.getDetail()
      this.getHonorList()
      this.getMomentList()
      this.getCommentList()
    })
  },

  /* 发布留言 */
  publishComment() {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    if (this.data.commentInputValue.trim() === '') {
      wx.showToast({
        title: '留言内容不能为空',
        icon: 'none'
      })
      return
    }
    bxPoint('teacher_message_write', {
      teacher_id: this.data.teacherId
    }, false)
    if (!this.data.commentPublishLock) {
      this.setData({
        commentPublishLock: true
      })
      publishTeacherNewComment({
        content: this.data.commentInputValue,
        belong_id: this.data.teacherId
      }).then(() => {
        wx.showToast({
          title: '留言成功',
          icon: 'none',
        })
        this.setData({
          commentInputValue: '',
          commentPublishLock: false
        })
        this.getCommentList()
      }).catch(() => {
        this.setData({
          commentPublishLock: false
        })
      })
    }

  },

  /* 输入留言内容 */
  inputComment(e) {
    let item = e.detail.value
    this.setData({
      commentInputValue: item
    })
  },

  /* 获取老师留言列表 */
  getCommentList() {
    getTeacherNewCommentList({
      tutor_id: this.data.teacherId,
      limit: 3
    }).then(({
      data
    }) => {
      let listCopy = data.list || []
      let list = []
      if (listCopy.length) {
        listCopy.map(item => {
          let obj = JSON.parse(JSON.stringify(item.comment))
          obj.has_like = item.has_like
          list.push(obj)
        })
      }
      this.setData({
        commentList: list,
        commentTotalCount: data.count
      })
    })
  },

  /* 获取老师动态列表 */
  getMomentList() {
    getTeacherNewMomentList({
      tutor_id: this.data.teacherId,
      limit: 6
    }).then(({
      data
    }) => {
      if (data.list.length) {
        data.list.map(item => {
          item.media_url = item.media_url ? item.media_url.split(',') : []
        })
      }
      this.setData({
        momentList: data.list || []
      })
    })
  },

  /* 获取老师荣誉列表 */
  getHonorList() {
    getTeacherNewHonorList({
      tutor_id: this.data.teacherId,
      limit: 3
    }).then(({
      data
    }) => {
      this.setData({
        honorList: data.list || []
      })
    })
  },

  /* 获取老师信息详情 */
  getDetail() {
    getTeacherNewInfo({
      tutor_id: this.data.teacherId
    }).then(({
      data
    }) => {
      let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
      data = Object.assign({}, data.tutor_info, {
        has_like: data.has_like
      })

      data.address = data.address ? data.address.split(',')[1] : ''
      data.address = data.address ? data.address.split('市')[0] : ''
      data.photo = data.photo_wall.split(",")
      data.keywordArr = data.keyword ? data.keyword.split(',') : []
      console.log(data)
      this.setData({
        teacherMainInfo: data,
        userInfo: userInfo ? JSON.parse(userInfo) : ''
      }, () => {
        this.getMedalList()
      })
    })
  },

  /* 获取banner列表 */
  getBannerList() {
    getFindBanner({
      scene: 25
    }).then(res => {
      this.setData({
        bottomBannerList: res || []
      })
    })
  },

  /* 获取勋章列表 */
  getMedalList() {
    getTeacherNewMedalList({
      authentication: this.data.teacherMainInfo.authentication,
      limit: 5
    }).then(({
      data
    }) => {
      this.setData({
        medalTotal: data.count,
        medalList: data.list || []
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getLocalStorage(GLOBAL_KEY.userId)) {
      this.setData({
        hasAuth: true
      })
    } else {
      this.setData({
        hasAuth: false
      })
    }
    if (options.id || options.scene) {
      this.setData({
        teacherId: options.id || options.scene
      }, () => {
        bxPoint('teacher_detail_page', {
          teacher_id: this.data.teacherId
        })
      })
      this.getBannerList()
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery.js',
      })
    }
  },

  onShow() {
    this.getDetail()
    this.getHonorList()
    this.getMomentList()
    this.getCommentList()
  },

  /* 查看banner大图 */
  visitEveryOne(e) {
    let url = e.currentTarget.dataset.item
    // let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: url,
      urls: this.data.teacherMainInfo.photo
    })
  },

  /* 滑动banner */
  switchBanner(e) {
    let index = e.detail.current
    this.setData({
      currentBannerIndex: index
    })
  },

  /* 前往留言板列表 */
  toMessageList() {
    bxPoint('teacher_message_wall_more', {
      teacher_id: this.data.teacherId
    }, false)
    wx.navigateTo({
      url: `/teacherModule/messageList/messageList?teacherId=${this.data.teacherId}&teacherUserId=${this.data.teacherMainInfo.user_id}`,
    })
  },

  /* 前往荣誉列表 */
  toHonorList() {
    bxPoint('teacher_my_honor_all', {
      teacher_id: this.data.teacherId
    }, false)
    wx.navigateTo({
      url: `/teacherModule/honorList/honorList?teacherId=${this.data.teacherId}`,
    })
  },

  /* 前往动态详情 */
  toMomentDetail(e) {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/teacherModule/momentDetail/momentDetail?momentId=${item.id}&teacherUserId=${this.data.teacherMainInfo.user_id}`,
    })
  },

  /* 前往动态列表 */
  toMomentList() {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }
    bxPoint('teacher_my_trends_all', {
      teacher_id: this.data.teacherId
    }, false)
    wx.navigateTo({
      url: `/teacherModule/momentList/momentList?teacherId=${this.data.teacherId}&teacherUserId=${this.data.teacherMainInfo.user_id}`,
    })
  },

  /* 前往分享 */
  toShare() {
    bxPoint('teacher_detail_share', {
      teacher_id: this.data.teacherId
    }, false)
    wx.navigateTo({
      url: `/teacherModule/poster/poster?teacherId=${this.data.teacherId}`,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "你点赞的老师动态更新了，一起来看看吧！",
      path: `/teacherModule/index/index?id=${this.data.teacherId}`
    }
  }
})