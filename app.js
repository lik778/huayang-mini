//app.js
import request from './lib/request'
import { checkAuth } from './utils/auth'

App({
	onLaunch: function () {
		// 全局注册http
		wx.$request = request
		// 每次打开app检查授权
		checkAuth()
	},
	onShow(options) {},
	onUnload() {},
	globalData: {}
})
