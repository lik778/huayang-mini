// pages/activePay/activePay.js
import {
  queryOrderDetail
} from "../../api/course/index"
import {
  getLocalStorage,
  payCourse
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    payData: {
      residueTime: "",
      activityName: "",
      activityTime: "",
      activitySite: "",
      activityPrice: 1,
      activityUserName: "",
      phoneNum: 0,
      code: "",
      successUrl: ""
    },
    btnName: "",
    prepay_id: "",
    overtime: true,
    order_id: 0,
    activity_key: "",
    mobile: "",
    lock: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      orderId
    } = options

    // 获取订单信息
    if (orderId) {
      queryOrderDetail({
        order_id: orderId
      }).then(({
        data: res
      }) => {
        let btnName = ""
        let overtime = false
        switch (res.order.status) {
          case 0:
            btnName = "立即支付"
            overtime = true
            break
          case 1:
            btnName = "立即支付"
            overtime = true
            break
          case 2:
            btnName = "已支付"
            overtime = false
            break
          case 3:
            btnName = "已发货"
            overtime = false
            break
          case 4:
            btnName = "确认已完成"
            overtime = false
            break
          case 5:
            btnName = "退款中"
            overtime = false
            break
          case 6:
            btnName = "退款已完成"
            overtime = false
            break
          case 7:
            btnName = "关闭状态"
            overtime = false
            break
          case 8:
            btnName = "支付超时"
            overtime = false
            break
        }
        let product_info = res.order_item_list[0].product_info
        let userName = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo)).nickname
        let payData = {
          residueTime: res.order.expired_at,
          activityName: product_info.title,
          activityTime: product_info.run_time,
          activitySite: product_info.address,
          activityPrice: res.order.real_price / 100,
          activityUserName: userName,
          phoneNum: res.order.mobile,
          code: res.order.num,
          successUrl: product_info.success_url,
          activityId: product_info.id
        }

        this.setData({
          btnName,
          overtime,
          payData,
          orderId
        })
        this.residueTime()
      })
    }
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
  pay() {
    if (this.data.orderId) {
      payCourse({
        id: this.data.orderId,
        name: "报名小程序付费活动"
      }).then((res) => {
        if (res.errMsg === "requestPayment:ok") {
          wx.redirectTo({
            url: this.data.payData.successUrl || `/others/applyResultForActivityInH5/applyResultForActivityInH5?orderId=${this.data.orderId}&activityId=${this.data.payData.activityId}`,
            fail() {
              wx.switchTab({
                url: "/pages/discovery/discovery"
              })
            }
          })
        }
      }).catch(() => {
        wx.redirectTo({
          url: "/pages/activePayCancel/activePayCancel?successUrl=" + encodeURIComponent(this.data.payData.successUrl) + "&orderId=" + this.data.orderId
        })
      })
    }
  },

  back() {
    if (this.data.payData.successUrl) {
      wx.redirectTo({
        url: this.data.payData.successUrl,
        fail() {
          wx.switchTab({
            url: "/pages/discovery/discovery"
          })
        }
      })
    }
  },

  // 倒计时用户支付时间
  residueTime() {
    let targetDate = this.data.payData.residueTime //目标日期秒数
    this.intervalMethods(targetDate)
    let timer = setInterval(() => {
      this.intervalMethods(targetDate, timer)
    }, 1000)
  },

  intervalMethods(targetDate, timer) {
    let nowDate = Math.round(new Date().getTime() / 1000) //秒(s)
    nowDate += 1
    let gapDate = targetDate - nowDate //剩余n秒数超时
    if (gapDate >= 0) {
      let hour = this.addZero(Math.floor((gapDate % (24 * 60 * 60)) / (60 * 60)))
      let minute = this.addZero(
        Math.floor(((gapDate % (24 * 60 * 60)) % (60 * 60)) / 60)
      )
      let second = this.addZero(
        Math.floor(((gapDate % (24 * 60 * 60)) % (60 * 60)) % 60)
      )
      let payData = {
        ...this.data.payData
      }
      payData.residueTime = hour + ": " + minute + ": " + second + " "
      this.setData({
        payData
      })
    } else {
      clearInterval(timer)
      this.setData({
        overtime: false,
        btnName: "支付超时"
      })
    }
  },

  addZero(e) {
    if (e < 10) {
      e = "0" + e
    }
    return e
  }

})