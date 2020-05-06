// mine/withdraw/withdraw.js
import {
  getLocalStorage,
  getUserInfoData,
  parseNumber
} from "../../utils/util"
import {
  withDrawFun
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
    exceed: true
  },
  // 检查提现金额
  checkMoneyNum(e) {
    let value = e.detail.value
    value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
    if (value.indexOf(".") < 0 && value != "") {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
      value = parseFloat(value);
    }
    this.setData({
      inputValue: value
    })
    if (parseFloat(value) < 20) {
      this.setData({
        changeCss: true,
        exceed: true
      })
    } else if (parseFloat(value) > parseFloat(this.data.canWithdrawPrice)) {
      this.setData({
        exceed: false,
        changeCss: true
      })
    } else if (value === "") {
      this.setData({
        exceed: true,
        changeCss: true
      })
    } else {
      this.setData({
        exceed: true,
        changeCss: false
      })
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
      changeCss: false,
      exceed: true
    })
  },
  // 提现
  withdraw() {
    if (this.data.repeatLock) {
      this.setData({
        repeatLock: false
      })
      let requestParams = {
        amount:parseNumber(this.data.inputValue),
        open_id: getLocalStorage(GLOBAL_KEY.openId)
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      withDrawFun(requestParams).then(res => {
        if (res.code === 0) {
          // 提现后线更新本地缓存
          getUserInfoData().then(() => {
            this.setData({
              repeatLock: true
            })
            wx.hideLoading()
            wx.navigateTo({
              url: '/mine/withdrawResult/withdrawResult?money=' + this.data.inputValue,
            })
          })
        } else {
          this.setData({
            repeatLock: true
          })
        }
      }).catch(({
        message
      }) => {
        wx.showToast({
          title: message,
          icon: "none",
          mask: true,
          duration: 2500
        })
        this.setData({
          repeatLock: true
        })
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
      // canWithdrawPrice: options.money
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
      canWithdrawPrice: JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).amount,
      inputValue: "",
      changeCss:true
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