// pages/auth/auth.js
import { wxGetUserInfoPromise, checkAuth } from '../../utils/auth.js'
import { GLOBAL_KEY } from '../../lib/config.js'
import { bindUserInfo } from "../../api/auth/index"
import { getLocalStorage, setLocalStorage } from "../../utils/util"

Page({

	/**
	 * Page initial data
	 */
	data: {},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {

	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {

	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {

	},
  /**
   * 一键微信授权
   */
	getUserInfo() {
		try {
			wxGetUserInfoPromise().then(async (response) => {
			  const userInfo = response.userInfo
				let params = {
          open_id: getLocalStorage(GLOBAL_KEY.openId),
					avatarUrl: userInfo.avatarUrl,
					city: userInfo.city,
					nickName: userInfo.nickName,
					province: userInfo.province,
					country: userInfo.country,
					gender: userInfo.gender
				}
				await bindUserInfo(params)
        checkAuth()
        // 返回上一页
        wx.nextTick(() => {
          wx.navigateBack()
        })
			})
		} catch (error) {
			console.log('用户取消微信授权')
		}
	},
  /**
   * 一键获取微信手机号
   * @param e
   */
	getPhoneNumber(e) {
		if (e.detail.errMsg.includes('ok')) {
			console.log(e.detail)
			// TODO 将加密数据传递给后台
		} else {
			console.log('用户取消手机号授权')
		}
	}
})
