// pages/live/live.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store'
import { getLiveList } from "../../api/live/index"
import { WeChatLiveStatus } from '../../lib/config'
import { getSchedule } from '../../utils/util'

const livePlayer = requirePlugin('live-player-plugin')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		WeChatLiveStatus,
		schedule: [],
		roomId: 4,
		customParams: {},
		liveList: [],
		liveListOffset: 0,
		liveListLimit: 100,
		didNoMore: false,
		liveStatusIntervalTimer: null
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
		this.queryLiveList()

		if (this.liveStatusIntervalTimer == null) {
			this.liveStatusIntervalTimer = setInterval(() => {
				const roomIds = this.data.liveList.map(_ => _.roomId)
				getSchedule(roomIds).then(this.handleLiveStatusCallback)
			}, 6 * 1000)
		}
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
		this.storeBindings.destroyStoreBindings()
		clearInterval(this.data.liveStatusIntervalTimer)
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
		if (this.data.didNoMore) {
			return console.log('没有更多数据～')
		}
		this.queryLiveList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
	},
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
	queryLiveList() {
		getLiveList({limit: this.data.liveListLimit, offset: this.data.liveListOffset}).then((data) => {
			if (data.length < this.data.liveListLimit) {
				this.data.didNoMore = true
			}
			this.data.liveListOffset = data.length
			// TODO 截取已创建的微信直播间
			data = data.filter((t) => [6, 7, 9].includes(t.zhibo_room.num))
			const result = data.map(item => {
				return {
					id: item.zhibo_room.id,
					roomId: item.zhibo_room.num,
					roomType: item.zhibo_room.room_type,
					roomName: item.zhibo_room.title,
					userId: item.zhibo_room.user_id,
					visitCount: item.zhibo_room.visit_count,
					coverPicture: item.zhibo_room.cover_pic,
					sharePicture: item.zhibo_room.share_pic,
					status: item.zhibo_room.status,
					liveStatus: 0,
					vipOnly: item.zhibo_room.vip_only
				}
			})

			const roomIds = result.map(_ => _.roomId)

			getSchedule(roomIds).then(this.handleLiveStatusCallback)

			this.setData({
				liveList: [...result],
			})
		})
	},
	handleLiveStatusCallback(callbackLiveStatus) {
		if (callbackLiveStatus.length > 0) {
			let originLiveList = [...this.data.liveList]
			callbackLiveStatus.forEach((_)=> {
				let tar = originLiveList.find(o => o.roomId === _.roomId)
				if (tar) {
					tar.liveStatus = _.liveStatus
				}
			})

			this.setData({
				liveList: [...originLiveList]
			})
		}
	}
})
