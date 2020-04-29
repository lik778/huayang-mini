//app.js
import { getLocalStorage, setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'

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
	onUnload() {},
	globalData: {}
})
