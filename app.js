//app.js
import { getLocalStorage, setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'
import { BxTracker } from './anka-tracker.min'
import trackerConfig from './anka.config'
const Tracker = BxTracker.generateTrackerInstance(trackerConfig)

App({
	onLaunch: function () {},
	onShow(options) {
		// 记录设备信息，保证进入详情页时可以获取到statusHeight自定义navibar
		if (!getLocalStorage(GLOBAL_KEY.systemParams)) {
			wx.getSystemInfo({
				complete: (res) => {
					setLocalStorage(GLOBAL_KEY.systemParams, res)
				},
			})
		}
	},
	// 初始化打点sdk
	initialPointMachine() {
		let openId = getLocalStorage(GLOBAL_KEY.openId)
		if (!openId || this.initialize) return false
		Tracker.asyncInitWithCommonData({
			open_id: openId,
			union_id: ''
		}).then(() => {
			this.initialize = true
			console.log('初始化成功，开始执行打点任务')
		})
	},
	onUnload() {},
	globalData: {}
})
