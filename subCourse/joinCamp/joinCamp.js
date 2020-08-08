// 加入训练营
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  checkAuth
} from "../../utils/auth"
import {
  getCampDetail,
  getHasJoinCamp,
  joinCamp
} from "../../api/course/index"
import {
  getLocalStorage,
  payCourse
} from "../../utils/util"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    campId: 0,
    titleName: "",
    joinTime: "",
    hasJoinAll: false,
    endTime: "",
    userInfo: "",
    campDetailData: {},
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      res.desc = res.desc.split(",")
      this.setData({
        titleName: res.name
      })
      let endTime = ''
      let pushTime = ''
      let data = res.start_date.split(",")
      for (let i in data) {
        if (endTime === '') {
          // 说明只有一个开营日期
          endTime = data[i]
        } else {
          // 多个开营日期
          if (Math.round(new Date(endTime) / 1000) > Math.round(new Date(data[i]) / 1000) || Math.round(new Date(data[i]) / 1000) > Math.round(new Date() / 1000)) {
            endTime = data[i]
          }
        }
      }
      pushTime = endTime.split("-")[1] + "月" + endTime.split("-")[2] + "日"
      console.log(res)
      this.setData({
        campDetailData: res,
        joinTime: pushTime,
        endTime: endTime,
        campId: id
      })
    })
  },
  // 加入训练营
  joinCamp() {
    bxPoint("camp_join", {}, false)
    joinCamp({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      // open_id:'oG8Rd5Zxr7cjV6tUdraUDdsOSS8w',
      date: this.data.endTime,
      traincamp_id: this.data.campId
    }).then((res) => {
      if (res.id) {
        payCourse({
          id: res.id,
          name: '加入训练营'
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
      } else {
        this.backFun({
          type: "success"
        })
      }
    })
  },
  // 集中处理支付回调
  backFun({
    type
  }) {
    if (type === 'fail') {
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
      setTimeout(() => {
        wx.redirectTo({
          url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&share=true`,
        })
      }, 2000)
    }
  },

  // 跳转到训练营详情
  checkCamp(id) {
    getHasJoinCamp({
      traincamp_id: id
    }).then(res => {
      if (res.length === 0 || res.status === 2) {
        this.getCampDetail(id)
        if (res.status === 2) {
          // 代表是已经加入过放弃的
          this.setData({
            hasJoinAll: true
          })
        }

      } else {
        wx.redirectTo({
          url: `/subCourse/campDetail/campDetail?id=${id}&share=true`,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    checkAuth({
      listenable: true,
      ignoreFocusLogin: true
    }).then(() => {
      let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      console.log(userInfo.is_zhide_vip)
      this.setData({
        campId: options.id,
        userInfo: userInfo
      })
      // id代表训练营ID
      this.checkCamp(this.data.campId)
    })
    bxPoint("camp_introduce", {
      from_uid: options.from_uid
    })
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
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })

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
      title: `我正在参加${this.data.campDetailData.name}，每天都有看的见的变化，快来试试`,
      path: "/subCourse/joinCamp/joinCamp?id=" + this.data.campId
    }
  }
})