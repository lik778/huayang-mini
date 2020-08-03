// 加入训练营
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  joinCamp,
  getHasJoinCamp,
  getCampDetail
} from "../../api/course/index"
import {
  getLocalStorage,
  getTodayDate,
  payCourse,
  manageWeek
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    campId: 0,
    joinTime: "",
    endTime: "",
    campDetailData: {},
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      res.desc = res.desc.split(",")
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
        wx.navigateTo({
          url: `/subCourse/campDetail/campDetail?id=${this.data.campId}`,
        })
      }, 2000)
    }
  },

  // 跳转到训练营详情
  checkCamp(id) {
    getHasJoinCamp({
      traincamp_id: id
    }).then(res => {
      if (res.length === 0) {
        this.getCampDetail(id)
      } else {
        wx.navigateTo({
          url: `/subCourse/campDetail/campDetail?id=${id}`,
        })
      }
    })
    // let endTime = ''
    // let pushTime = ''
    // let data = e.start_date.split(",")
    // for (let i in data) {
    //   if (endTime === '') {
    //     // 说明只有一个开营日期
    //     endTime = data[i]
    //   } else {
    //     // 多个开营日期
    //     if (Math.round(new Date(endTime) / 1000) > Math.round(new Date(data[i]) / 1000) || Math.round(new Date(data[i]) / 1000) > Math.round(new Date() / 1000)) {
    //       endTime = data[i]
    //     }
    //   }
    // }
    // pushTime = endTime.split("-")[1] + "月" + endTime.split("-")[2] + "日"



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // id代表训练营ID
    this.checkCamp(options.id)
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

  }
})