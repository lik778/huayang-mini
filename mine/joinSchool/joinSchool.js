// mine/joinSchool/joinSchool.js
import { GLOBAL_KEY } from "../../lib/config"
import { getLocalStorage, setLocalStorage } from "../../utils/util"
import request from "../../lib/request"
import { getUniversityCode } from "../../api/mine/index"
import { checkAuth } from "../../utils/auth"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '0',
    webViewData: 0,
    baseUrl: "",
    statusHeight: ""
  },
  // 切换性别
  changeSex(e) {
    this.setData({
      radio: e.detail
    })
    console.log(e.detail)
  },
  getWebViewData(mobile) {
    this.setData({
      webViewData: JSON.stringify({
        userId: wx.getStorageSync(GLOBAL_KEY.userId),
        open_id: wx.getStorageSync(GLOBAL_KEY.openId),
      })
    })

  },
  checkUserAuth({is_zhide_vip, student_num}) {
    if (is_zhide_vip) {
      if (student_num) {
        getUniversityCode(`user_key=daxue`).then(res => {
          wx.navigateTo({
            url: `/subLive/courseList/courseList?id=${res.data.id}`,
          })
        })
      } else {
        // 继续填写大学入学申请
        if (!getLocalStorage(GLOBAL_KEY.repeatView)) {
          setLocalStorage(GLOBAL_KEY.repeatView, true)
          wx.navigateTo({
            url: '/mine/joinSchool/joinSchool',
          })
        }
      }
    } else {
      wx.navigateTo({
        url: `/mine/joinVip/joinVip?from=article`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    checkAuth({listenable: true}).then(() => {
      let userId = getLocalStorage(GLOBAL_KEY.userId)
      let { is_zhide_vip, student_num } = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
      if (userId == null) {
        wx.navigateTo({url: '/pages/auth/auth'})
      } else {
        this.getWebViewData()
        // 如果是从公众号来的需要二次检查用户VIP、学籍号
        this.checkUserAuth({is_zhide_vip, student_num})
      }
      this.setData({
        statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
        baseUrl: request.baseUrl
      })
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
			title: '花样大学入学申请',
			path: `/mine/joinSchool/joinSchool`
		}
  }
})
