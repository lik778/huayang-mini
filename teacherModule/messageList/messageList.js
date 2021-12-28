// teacherModule/messageList/messageList.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getTeacherNewCommentList,
  publishTeacherNewComment,
  deleteTeacherNewComment,
  likeTeacherNewComment
} from "../../api/teacherModule/index"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538156QZXmPX.jpg",
    unLikeIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538135qpLqha.jpg',
    pagination: {
      tutor_id: '',
      offset: 0,
      limit: 10
    },
    teacherId: "",
    teacherUserId: "",
    noData: false,
    didShowAuth: false,
    hasAuth: false,
    commentPublishLock: false,
    isOwner: false,
    commentInputValue: "",
    commentList: [],
    likeTapList: [],
    timer: null,
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
    let index = e.currentTarget.dataset.index
    let list = this.data.commentList.concat([])
    let likeTapList = this.data.likeTapList.concat([])

    if (this.data.likeTapList.indexOf(item.id) === -1) {
      likeTapList.push(item.id)
    } else {
      let index = this.data.likeTapList.indexOf(item.id)
      likeTapList.splice(index, 1)
    }

    list[index].has_like = !list[index].has_like
    list[index].like_count = list[index].has_like ? list[index].like_count + 1 : list[index].like_count - 1
    this.setData({
      commentList: list,
      likeTapList
    })

    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }

    this.setData({
      likeTapList: [],
      timer: setTimeout(() => {
        this.data.likeTapList.map(item => {
          likeTeacherNewComment({
            comment_id: item
          })
        })
      }, 1000)
    })


  },

  /* 删除评论 */
  deleteComment(e) {
    let item = e.currentTarget.dataset.item
    wx.showModal({
      content: "确认删除",
      confirmText: "删除",
      confirmColor: '#ff5544',
      success: (res) => {
        if (res.confirm) {
          deleteTeacherNewComment({
            comment_id: item.id
          }).then(() => {
            wx.showToast({
              title: '删除成功',
              icon: "success",
            })
            wx.pageScrollTo({
              duration: 100,
              scrollTop: 0,
              success: () => {
                this.setData({
                  ['pagination.offset']: 0
                }, () => {
                  this.getCommentList(true)
                })
              }
            })

          })
        }
      }
    })
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
      hasAuth: true
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
    bxPoint('teacher_message_wall_write', {
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
        wx.pageScrollTo({
          duration: 200,
          scrollTop: 0,
          success: () => {
            this.setData({
              commentInputValue: '',
              noData: false,
              commentPublishLock: false,
              ['pagination.offset']: 0
            }, () => {
              this.getCommentList(true)
            })
          }
        })

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
  /* 获取留言列表 */
  getCommentList(refresh = false) {
    getTeacherNewCommentList(this.data.pagination).then(({
      data
    }) => {
      let listCopy = this.data.commentList.concat()
      let list = []
      if (data.list.length) {
        data.list.map(item => {
          let obj = JSON.parse(JSON.stringify(item.comment))
          obj.has_like = item.has_like
          list.push(obj)
        })
      }
      listCopy = refresh ? list : listCopy.concat(list)
      this.setData({
        commentList: listCopy,
        noData: data.list ? data.list.length >= this.data.pagination.limit ? false : true : true
      })
    })
  },

  /* 初始化登录状态 */
  initUserAuthStatus() {
    let publishUserId = this.data.teacherUserId
    let authUserId = getLocalStorage(GLOBAL_KEY.userId) ? getLocalStorage(GLOBAL_KEY.userId) : ''

    if (Number(publishUserId) === Number(authUserId)) {
      this.setData({
        isOwner: true
      })
    } else {
      this.setData({
        isOwner: false
      })
    }
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
    if (options.teacherId && options.teacherUserId) {
      this.setData({
        ['pagination.tutor_id']: options.teacherId,
        teacherId: options.teacherId,
        teacherUserId: options.teacherUserId
      }, () => {
        bxPoint('teacher_message_wall_page', {
          teacher_id: this.data.teacherId
        })
        this.getCommentList()
        this.initUserAuthStatus()
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },


  onReachBottom: function () {
    if (!this.data.noData) {
      this.setData({
        ['pagination.offset']: this.data.pagination.offset + this.data.pagination.limit
      }, () => {
        this.getCommentList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "花样留言板，有好友给你点赞的老师留言了",
      path: `/teacherModule/index/index?id=${this.data.teacherId}`
    }
  }
})