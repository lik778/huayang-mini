import { getActivityDetail, getFluentCardInfo } from "../../api/mine/index"
import { getLocalStorage, hasAccountInfo, hasUserInfo, removeLocalStorage, setLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */

  data: {
    didShowFluentLearnModal: false,
    originLink: "",
    link: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { link = "", didUserIsFluentCardMember = "" } = options
    this.setData({originLink: link})
    if (didUserIsFluentCardMember === "yes") {
      setLocalStorage("hy_did_check_User_indentity_in_active_platform", didUserIsFluentCardMember)
      this.setData({originLink: `${link}&didUserIsFluentCardMember=${didUserIsFluentCardMember}`})
    }
    while (link.includes("%")) {
      link = decodeURIComponent(link)
    }
    link += `?platform=applet&userId=${getLocalStorage(GLOBAL_KEY.userId)}`
    if (hasUserInfo() && hasAccountInfo()) {
      this.setData({link})
    } else {
      let url = "/pages/activePlatform/activePlatform?link=" + link
      wx.redirectTo({url: `/pages/auth/auth?redirectType=redirect&didNeedDecode=1&redirectPath=${encodeURIComponent(url)}`})
      return false
    }

    // 校友活动需要成为花样大学学生
    let didCheckUserIdentityInActivePlatform = getLocalStorage("hy_did_check_User_indentity_in_active_platform")
    if (didCheckUserIdentityInActivePlatform === "yes" && hasAccountInfo()) {
      removeLocalStorage("hy_did_check_User_indentity_in_active_platform")
      let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
      getFluentCardInfo({user_snow_id: accountInfo.snow_id}).then(({data: fluentCardInfo}) => {
        if (!fluentCardInfo) {
          wx.redirectTo({url: "/subCourse/collegeActivity/collegeActivity"})
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: async function () {
    let mats = this.data.link.match(/detail\/(\w+)/)
    let title = "花样活动"
    if (mats.length >= 2) {
      let detail = await getActivityDetail({activity_id: mats[1], user_id: getLocalStorage(GLOBAL_KEY.userId)})
      title = detail.share_title
    }
    return {
      title,
      link: "/pages/activePlatform/activePlatform?link=" + this.data.originLink
    }
  },
})
