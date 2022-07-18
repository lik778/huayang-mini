// subCourse/campPeriodList/campPeriodList.js
import {
  getCampDetail,
  getMenyCourseList,
  getHasJoinCamp
} from "../../api/course/index"
import {
  convertToChinaNum,
  dateAddDays,
  computeDate,
  hasAccountInfo,
  hasUserInfo
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campData: "",
    campId: "",
    courseList: "",
    joinDate: '',
    whatDay: "",
    periodList: [],
    share: false
  },

  // 返回训练营详情
  backCampDetail() {
    wx.navigateBack()
  },

  // 选中某一天日期
  toDetail(e) {
    let index = e.currentTarget.dataset.item
    let pageLength = getCurrentPages()
    if (pageLength.length > 8) {
      wx.redirectTo({
        url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&dayNum=${index}`,
      })
    } else {
      wx.navigateTo({
        url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&dayNum=${index}&back=list`,
      })
    }
  },

  // 获取训练营数据
  getCampDetailData(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      this.setData({
        campData: res
      })
      let oneDaySecond = 86400
      let formatType = 'yyyy-MM-dd'
      let nowDate = new Date().getTime()
      let startDate = new Date(this.data.joinDate).getTime()
      let endDateStr = dateAddDays(this.data.joinDate, res.period * oneDaySecond, formatType)
      let endDate = new Date(endDateStr).getTime()
      if (nowDate >= startDate && nowDate <= endDate) {
        // 开营中
        let whatDay = computeDate(new Date().getTime(), new Date(this.data.joinDate).getTime())
        this.setData({
          whatDay
        })
      }
      this.getManyCamoData(res.period)
    })
  },

  // 获取多个训练营数据
  getManyCamoData(period) {
    getMenyCourseList({
      traincamp_id: this.data.campId
    }).then(res => {
      this.setData({
        periodList: res || []
      })
    })
  },

  // 取某个区间内的所有正整数(0-8含8)
  getAllNum(min, max) {
    let chinaNum = []
    let num1 = []
    for (let i = min; i < max + 1; i++) {
      let a = convertToChinaNum(i)
      num1.push(i)
      chinaNum.push(a)
    }
    return {
      chinaNum,
      num1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      campId = '', joinDate = '', share = false
    } = options

    /* 判断是否携带必要参数 */
    if (!campId || !joinDate) {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
      return
    }

    /* 判断是否授过权 */
    if (!hasAccountInfo() || !hasUserInfo()) {
      wx.redirectTo({
        url: `/subCourse/joinCamp/joinCamp?id=${campId}`
      })
      return
    }

    /* 判断是否加入过训练营 */
    getHasJoinCamp({
      traincamp_id: campId
    }).then(res => {
      if (!res.status || res.status !== 1) {
        wx.redirectTo({
          url: `/subCourse/joinCamp/joinCamp?id=${campId}`,
        })
        return
      }
    })

    this.setData({
      campId,
      joinDate,
      share
    })
    this.getCampDetailData(campId)
  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {
    return {
      title: `${this.data.campData.name}`,
      path: `/subCourse/campPeriodList/campPeriodList?campId=${this.data.campId}&joinDate=${this.data.joinDate}&share=true`
    }
  }
})