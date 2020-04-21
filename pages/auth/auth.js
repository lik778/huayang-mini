// pages/auth/auth.js
import { wxGetUserInfoPromise } from '../../utils/auth.js'
import { GLOBAL_KEY } from '../../lib/config.js'
import { bindUserInfo, bindWxPhoneNumber, getWxInfo } from "../../api/auth/index"
import { getLocalStorage, setLocalStorage } from "../../utils/util"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import { getUniversityCode } from "../../api/mine/index"
import { APP_LET_ID } from "../../lib/config"
import { wxLoginPromise } from "../../utils/auth"

Page({

	/**
	 * Page initial data
	 */
	data: {
		didFromPublic: false,
		show: false
	},
	jumpToPrivacy() {
		wx.navigateTo({
			url: '/pages/privacy/privacy'
		})
	},
	jumpToService() {
		wx.navigateTo({
			url: '/pages/service/service'
		})
	},
	/**
	 * 一键微信授权
	 */
	getUserInfo() {
		try {
			wxLoginPromise()
				.then(async (code) => {
					// 用code查询服务端是否有该用户信息，如果有更新本地用户信息，反之从微信获取用户信息保存到服务端
					let wxOriginUserInfo = await getWxInfo({code, app_id: APP_LET_ID.tx})
					// 缓存openId
					setLocalStorage(GLOBAL_KEY.openId, wxOriginUserInfo.openid)

					wxGetUserInfoPromise().then(async (response) => {
						const userInfo = response.userInfo
						let params = {
							open_id: getLocalStorage(GLOBAL_KEY.openId),
							avatar_url: userInfo.avatarUrl,
							city: userInfo.city,
							nickname: userInfo.nickName,
							province: userInfo.province,
							country: userInfo.country,
							gender: userInfo.gender
						}
						let originUserInfo = await bindUserInfo(params)
						setLocalStorage(GLOBAL_KEY.userInfo, originUserInfo)
						if (this.data.didFromPublic) {
							let userId = getLocalStorage(GLOBAL_KEY.userId)
							let { is_zhide_vip, student_num } = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
							if (userId == null) {
								this.setData({
									show: true
								})
							} else {
								if (is_zhide_vip) {
									if (student_num) {
										Dialog.confirm({
											title: '提示',
											message: '您已是花样大学学员',
											confirmButtonText: '查看课程',
											showCancelButton: false
										}).then(() => {
											getUniversityCode(`user_key=daxue`).then(res => {
												wx.navigateTo({
													url: `/subLive/courseList/courseList?id=${res.data.id}`,
												})
											})
										}).catch(() => {})
									} else {
										wx.navigateTo({
											url: '/mine/joinSchool/joinSchool',
										})
									}
								} else {
									Dialog.confirm({
										title: '提示',
										message: '花样大学为花样汇超级会员专属权益，您暂无权限申请',
										confirmButtonText: '立即加入“花样汇”',
										showCancelButton: false
									}).then(() => {
										wx.navigateTo({
											url: `/mine/joinVip/joinVip?from=${this.data.fromPath}`,
										})
									}).catch(() => {})
								}
							}
						} else {
							wx.navigateBack()
						}
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
	async getPhoneNumber(e) {
		if (!e) return
		let {
			errMsg = '', encryptedData: encrypted_data = '', iv = ''
		} = e.detail
		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({
					open_id,
					encrypted_data,
					iv
				})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			}
		} else {
			console.error('用户拒绝手机号授权')
		}
	},
	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		let fromPath = options.from
		// 判断是否来自公众号文章
		if (fromPath != null) {
			this.setData({
				didFromPublic: true,
				fromPath
			})
		}
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

	}
})
