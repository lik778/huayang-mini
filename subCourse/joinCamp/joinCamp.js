// 加入训练营
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  joinCamp,
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
    joinTime:"",
    campDetailData: {},
  },
  // 获取训练营详情
  getCampDetail(id) {
    getCampDetail({
      traincamp_id: id
    }).then(res => {
      res.desc = res.desc.split(",")
      this.setData({
        campDetailData: res
      })
    })
  },
  // 加入训练营
  joinCamp() {
    joinCamp({
      open_id: getLocalStorage(GLOBAL_KEY.openId),
      traincamp_id: this.data.campId
    }).then((res) => {
      if (res.id) {
        payCourse({
          id: res.id,
          name: '测试'
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      campId: options.id,
      joinTime: options.time
    })
    this.getCampDetail(options.id)
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