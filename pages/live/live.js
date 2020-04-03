// pages/live/live.js
import {
	createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
	store
} from '../../store'
import {
	getLiveList
} from "../../api/live/index"
import {
	WeChatLiveStatus
} from '../../lib/config'

const livePlayer = requirePlugin('live-player-plugin')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		roomId: 4,
		customParams: {},
		liveList: []
	},
	// 跳转至课程列表
	toCourese() {
		wx.navigateTo({
			url: '../../subLive/courseList/courseList',
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.storeBindings = createStoreBindings(this, {
			store,
			fields: [],
			actions: [],
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		getLiveList({
			limit: 100
		}).then((data) => {
			console.log(this.batchQueryLiveStatus(data))
			this.setData({
				liveList: data.slice()
			})
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.navigateTo({
			url: '../../subLive/courseList/courseList'
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
		this.storeBindings.destroyStoreBindings()
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
	onShareAppMessage: function () {},
	/**
	 * 跳转到微信直播页面
	 * @param e
	 */
	navigateToLive(e) {
		let targetId = e.currentTarget.dataset.item.roomId
		this.setData({
			roomId: targetId
		})
		wx.navigateTo({
			url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${targetId}&custom_params=${encodeURIComponent(JSON.stringify(this.data.customParams))}`
		})
	},
	batchQueryLiveStatus(list = []) {
		let session = list.map(item => {
			return new Promise((resolve, reject) => {
				this.queryLiveStatus(item.roomId).then((response) => {
					resolve(response)
				}).catch(() => {
					reject('no response')
				})
			})
		})
		let result = []
		session.forEach(async (promise, index) => {
			let result = await promise
			console.log(index, WeChatLiveStatus[result.liveStatus])
			// result.push(WeChatLiveStatus[result.liveStatus])
		})

		return result
	},
	/**
	 * 查询直播间的状态
	 * @param roomId
	 * @returns {Promise<unknown>}
	 */
	queryLiveStatus(roomId) {
		return new Promise((resolve, reject) => {
			livePlayer.getLiveStatus({
					room_id: roomId
				})
				.then(response => {
					resolve(response)
				})
				.catch(error => {
					console.error(error)
					reject(error)
				})
		})
	}
})