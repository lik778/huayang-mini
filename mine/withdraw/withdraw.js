// mine/withdraw/withdraw.js
import {
  getLocalStorage,
  checkIsPrice
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  kechengTakeout
} from "../../api/markting/course"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    takeoutNum: "",
    lock: true,
    userInfo: ""
  },

  // 返回
  back() {
    wx.redirectTo({
      url: '/mine/promotion/promotion',
    })
  },

  // 实时更新输入框文字
  changeInputValue(e) {
    let text = e.detail.value
    this.setData({
      takeoutNum: Number(text)
    })
  },

  // 全部提现
  withdrawAll() {
    this.setData({
      takeoutNum: Number(this.data.userInfo.kecheng_user.deposit)
    })
  },

  // 提现结果
  toWithdrawResult() {
    console.log(this.data.takeoutNum, this.data.userInfo.kecheng_user.deposit)
    if (this.data.takeoutNum === '') {
      wx.showModal({
        title: '提示',
        content: '提现金额不能为空',
        showCancel: false
      })
      return
    } else if (this.data.takeoutNum < 20) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能低于20元',
        showCancel: false
      })
      return
    } else if (!checkIsPrice(this.data.takeoutNum)) {
      wx.showModal({
        title: '提示',
        content: '提现金额错误',
        showCancel: false
      })
      return
    } else if (this.data.takeoutNum > this.data.userInfo.kecheng_user.deposit) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能超过感谢金余额',
        showCancel: false
      })
      return
    }
    if (this.data.lock) {
      this.setData({
        lock: false
      })
      kechengTakeout({
        user_id: getLocalStorage(GLOBAL_KEY.userId),
        takeout_num: this.data.takeoutNum * 100
      }).then(res => {
        if (res.code === 0) {
          wx.navigateTo({
            url: '/mine/withdrawResult/withdrawResult',
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            this.setData({
              lock: true
            })
          }, 1500)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    userInfo.kecheng_user.deposit = Number((userInfo.kecheng_user.deposit / 100).toFixed(2))
    this.setData({
      userInfo
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

})