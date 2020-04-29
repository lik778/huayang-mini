// mine/withdraw/withdraw.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  withDraw
} from "../../api/mine/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyboardHeight: 0,
    canWithdrawPrice: 0,
    inputValue: "",
    changeCss: true,
    statusHeight: 0,
    specialHeight: 0,
    repeatLock: true,
  },
  // 检查提现金额
  checkMoneyNum(e) {
    let regNum = new RegExp('[0-9]', 'g');
    let rsNum = regNum.exec(e.detail.value);
    if (!rsNum) {
      this.setData({
        inputValue: ""
      })
      return false
    } else {
      return true
    }
  },
  // 输入框改变输入
  changeInputValue(e) {
    // 正则检查提现金额
    let result = this.checkMoneyNum(e)
    if (!result) {
      return
    }
    if (e.detail.value === '' || Number(e.detail.value) < 20) {
      this.setData({
        changeCss: true,
        inputValue: e.detail.value
      })
    } else {
      this.setData({
        changeCss: false,
        inputValue: e.detail.value
      })
    }
  },
  // 获取焦点处理定位
  getPosition() {
    wx.getSystemInfo({
      success: (res) => {
        if (res.windowHeight >= 812) {
          this.setData({
            keyboardHeight: 76,
            specialHeight: 68
          })
        } else {
          this.setData({
            keyboardHeight: 0,
            specialHeight: 0
          })
        }
      },
    })
  },
  // 全部提现
  allWithdraw() {
    this.setData({
      inputValue: this.data.canWithdrawPrice || 0,
      changeCss: true
    })
  },
  // 提现
  withdraw() {
    if (this.data.repeatLock) {
      this.setData({
        repeatLock: false
      })
      let requestParams = {
        amount: this.data.inputValue,
        open_id: getLocalStorage(GLOBAL_KEY.openId)
      }
      withDraw(requestParams).then(res => {
        if (res.code === 0) {
          console.log(res)
          // wx.navigateTo({
          //   url: '/mine/withdrawResult/withdrawResult?money=' + this.data.inputValue,
          // })
        } else {
          this.setData({
            repeatLock: false
          })
        }

      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPosition()
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      canWithdrawPrice: options.money
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