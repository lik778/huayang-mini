//app.js
import request from './lib/request'
import { setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'

let livePlayer = requirePlugin('live-player-plugin')
App({
	onLaunch: function () {
		// 全局注册http
		wx.$request = request
		// 每次打开app检查授权
		// checkAuth()
		// 记录设备信息，保证进入详情页时可以获取到statusHeight自定义navibar
		wx.getSystemInfo({
			complete: (res) => {
				setLocalStorage(GLOBAL_KEY.systemParams,res)
			},
		})
	},
	onShow(options) {
		// 分享卡片入口场景才调用getShareParams接口获取以下参数
		if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
			livePlayer.getShareParams()
				.then(res => {
					console.log('get room id', res.room_id) // 房间号
					console.log('get openid', res.openid) // 用户openid
					console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
					console.log('get custom params', res.custom_params) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
				}).catch(err => {
				console.log('get share params', err)
			})
		}
	},
	onUnload() {},
	globalData: {}
})
