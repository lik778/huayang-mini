// teacherModule/teacherList/teacherList.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getTeacherNewTeacherList,
  likeTeacherNew
} from "../../api/teacherModule/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTab: false,
    likeIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538156QZXmPX.jpg",
    unLikeIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538135qpLqha.jpg',
    currentTabIndex: 1,
    pagination: {
      offset: 0,
      limit: 10
    },
    noData: false,
    paginationLock: false,
    list: [],
    didShowAuth: false, //授权弹窗
    hasAuth: false, //是否授完权
  },

  catchTap(){},

  /* 前往老师详情 */
  toTeacherDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/teacherModule/index/index?id=${item.id}`,
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
    }, () => {
      this.getList(true)
    })
  },

  /* 点赞老师 */
  likeTeacher(e) {
    if (!this.data.hasAuth) {
      this.setData({
        didShowAuth: true
      })
      return
    }

    let item = e.currentTarget.dataset.item
    let limit = this.data.pagination.offset + this.data.pagination.limit
    likeTeacherNew({
      tutor_id: item.id
    }).then(res => {
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
      this.setData({
        ['pagination.offset']: 0,
        ['pagination.limit']: limit,
      }, () => {
        this.getList(true)
      })
    })
  },

  /* 获取老师列表 */
  getList(refresh = false) {
    if (!this.data.paginationLock) {
      this.setData({
        paginationLock: true
      })
      getTeacherNewTeacherList(this.data.pagination).then(({
        data
      }) => {
        let list = []
        if (data.list.length) {
          data.list.map(item => {
            item.tutor_info.headIcon = item.tutor_info.photo_wall ? item.tutor_info.photo_wall.split(',')[0] : ''
            list.push({
              ...item.tutor_info,
              has_like: item.has_like
            })
          })
        }
        let listCopy = refresh ? list || [] : this.data.list.concat(list || [])
        this.setData({
          paginationLock: false,
          list: listCopy,
          noData: data.list.length >= this.data.pagination.limit ? false : true
        })
        console.log(list)
      })
    }

  },

  /* 切换tab */
  changeTab(e) {
    let item = Number(e.currentTarget.dataset.index)
    this.setData({
      currentTabIndex: item
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
    this.getList()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noData) {
      this.setData({
        ['pagination.offset']: this.data.pagination.offset + this.data.pagination.limit,
      }, () => {
        this.getList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "花样之星-花样优秀师资介绍",
    }
  }
})