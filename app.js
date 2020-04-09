//app.js
import request from './lib/request'
import { checkAuth } from './utils/auth'
import { removeLocalStorage } from "./utils/util"
import { GLOBAL_KEY } from "./lib/config"

App({
	onLaunch: function () {
		// 全局注册http
		wx.$request = request
		// 每次打开app检查授权
		checkAuth()
	},
	onShow(options) {},
	onUnload() {
		console.log('清除计划表');
		removeLocalStorage(GLOBAL_KEY.schedule)
	},
	globalData: {}
})
