// teacherModule/momentList/momentList.js
import {
  getTeacherNewMomentList
} from "../../api/teacherModule/index"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import dayjs from "dayjs"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639626899gtUcEr.jpg",
    playIcon: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639538242RdmCxq.jpg',
    pagination: {
      tutor_id: "",
      offset: 0,
      limit: 10
    },
    statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
    type: 3,
    teacherUserId: "",
    lastMomentBelongYear: "",
    backPath: "",
    momentList: [],
    noData: false,
    isOwner: false
  },

  /* 获取动态列表 */
  getMomentList(refresh = false) {
    getTeacherNewMomentList(this.data.pagination).then(({
      data
    }) => {
      let list = data.list || []
      let yestoday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      let today = dayjs().format('YYYY-MM-DD')
      let nowYear = dayjs().format('YYYY')
      let lastMomentYear = this.data.lastMomentBelongYear || nowYear
      if (list.length) {
        let dateTypeList = []
        list.map((item) => {
          let time = item.time.split(" ")[0]
          if (dayjs(time).isSame(dayjs(yestoday))) {
            item.dateType = dateTypeList.indexOf('昨天') === -1 ? '昨天' : ''
          } else if (dayjs(time).isSame(dayjs(today))) {
            item.dateType = dateTypeList.indexOf('今天') === -1 && !this.data.isOwner ? '今天' : ''
          } else {
            let year = time.split('-')[0]
            let month = time.split('-')[1]
            let day = time.split('-')[2]
            item.dateType = dateTypeList.indexOf([year, month, day]) === -1 ? [year, month, day] : ''
          }
          if (item.dateType) {
            dateTypeList.push(item.dateType)
          }

          if (item.type === 2) {
            item.media_type = 5
          } else {
            let url = item.media_url.split(',')
            if (url.length <= 1) {
              item.media_type = 1
            } else if (url.length === 2) {
              item.media_type = 2
            } else if (url.length === 3) {
              item.media_type = 3
            } else if (url.length >= 4) {
              item.media_type = 4
            }
            item.media_src = url
          }
          item.content = item.content.length > 38 ? item.content.substring(0, 38) + '...' : item.content
        })
        let newList = JSON.parse(JSON.stringify(refresh ? list : this.data.momentList.concat(list)))
        newList.map((item, index) => {
          let nowMomentYear = item.time.split(' ')[0].split('-')[0]
          if (nowMomentYear !== lastMomentYear) {
            lastMomentYear = nowMomentYear
            newList.splice(index, 0, {
              time: '',
              yearType: true,
              year: nowMomentYear
            })
          }
        })
        this.setData({
          momentList: newList,
          lastMomentBelongYear: lastMomentYear,
          noData: data.list.length >= 10 ? false : true
        })
      }
    })
  },

  /* 前往发布动态 */
  toUpload() {
    wx.navigateTo({
      url: `/teacherModule/momentPublish/momentPublish?teacherId=${this.data.pagination.tutor_id}`,
    })
  },

  /* 前往动态详情 */
  toMomentDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/teacherModule/momentDetail/momentDetail?momentId=${item.id}&teacherUserId=${this.data.teacherUserId}`,
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
    if (options.teacherId && options.teacherUserId) {
      this.setData({
        ['pagination.tutor_id']: options.teacherId,
        teacherUserId: options.teacherUserId,
        backPath: `/teacherModule/index/index?id=${options.teacherId}`
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },

  onShow() {
    this.setData({
      lastMomentBelongYear: "",
      ['pagination.offset']: 0,
      momentList: [],
      noData: false,
      isOwner: false
    }, () => {
      this.initUserAuthStatus(true)
      this.getMomentList()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noData) {
      this.setData({
        ['pagination.offset']: this.data.pagination.offset + this.data.pagination.limit
      }, () => {
        this.getMomentList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "有一条你关注的动态",
      path: `/teacherModule/index/index?id=${this.data.pagination.tutor_id}`
    }
  }
})