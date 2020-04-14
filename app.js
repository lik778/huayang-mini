//app.js
import request from './lib/request'
import { checkAuth } from './utils/auth'
import { setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'
App({
	onLaunch: function () {
		// 全局注册http
		wx.$request = request
		// 每次打开app检查授权
		checkAuth()
		// 记录设备信息，保证进入详情页时可以获取到statusHeight自定义navibar
		wx.getSystemInfo({
			complete: (res) => {
				setLocalStorage(GLOBAL_KEY.systemParams,res)
			},
		})
	},
	onShow(options) {},
	onUnload() {},
	globalData: {}
})
