// subLive/review/review.js
import { getLiveInfo, getWatchLiveAuth, statisticsWatchNo } from "../../api/live/course"
import { getLocalStorage, setLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"
import { checkAuth } from "../../utils/auth"
import { bindWxPhoneNumber } from "../../api/auth/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		zhiboRoomInfo: {},
		zhiboRoomId: 0,
	},
	haveMore() {
		const type = this.data.zhiboRoomInfo.zhibo_room.room_type
		const officialRoomId = this.data.zhiboRoomInfo.zhibo_room.user_id
		if (type === 'kecheng') {
			wx.redirectTo({
				url: `/subLive/courseList/courseList?id=${officialRoomId}`,
			})
		} else {
			wx.switchTab({
				url: '/pages/index/index'
			})
		}
	},
	auth(zhiboRoomId) {
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		if (userId == null) {
			wx.navigateTo({url: '/pages/auth/auth'})
		} else {
			// 获取直播权限
			getWatchLiveAuth({room_id: zhiboRoomId, user_id: userId}).then(res => {
				if (res === 'vip') {
					wx.navigateTo({
						url: `/mine/joinVip/joinVip?from=review&zhiboRoomId=${this.data.zhiboRoomId}`,
					})
				} else if (res === 'daxue') {
					// 未加入花样大学,跳往入学申请页
					Dialog.confirm({
						showCancelButton: false,
						title: '申请入学立即观看',
						message: '完成入学信息登记，观看课程'
					})
						.then(() => {
							wx.navigateTo({
								url: '/mine/joinSchool/joinSchool',
							})
						})
				} else {
					// 反之，有权限查看
					// 优先统计观看人数
					statisticsWatchNo({
						zhibo_room_id: zhiboRoomId,
						open_id: getLocalStorage(GLOBAL_KEY.openId)
					})
				}
			})
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
			this.auth(this.data.zhiboRoomId)
			console.error('用户拒绝手机号授权')
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function ({zhiboRoomId}) {
		this.setData({zhiboRoomId})
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
		checkAuth({listenable: true}).then(() => {
			let zhiboRoomId = this.data.zhiboRoomId
			getLiveInfo({zhibo_room_id: zhiboRoomId}).then((response) => {
				this.setData({
					zhiboRoomInfo: { ...response },
					zhiboRoomId
				})
				zhiboRoomId && this.auth(zhiboRoomId)
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
			title: '花样直播',
			path: `/subLive/review/review?zhiboRoomId=` + this.data.zhiboRoomId,
		}
	}
})
