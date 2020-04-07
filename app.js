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
	onShow(options) {
	  // 通过直播插件获取用户openId
    // livePlayer.getOpenid({ room_id: 4 }) // 该接口传入参数为房间号
    //   .then(res => {
    //     console.log('通过直播插件获取用户openId', res.openid) // 用户openid
    //   }).catch(err => {
    //   console.error('通过直播插件获取用户openId', err)
    // })

		// 分享卡片入口场景才调用getShareParams接口获取以下参数
		// if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
		// 	livePlayer.getShareParams()
		// 		.then(res => {
		// 			console.log('分享卡片入口 room id', res.room_id) // 房间号
		// 			console.log('分享卡片入口 openid', res.openid) // 用户openid
		// 			console.log('分享卡片入口 share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
		// 			console.log('分享卡片入口 custom params', res.custom_params) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
		// 		}).catch(err => {
		// 		console.error('分享卡片入口 share params', err)
		// 	})
		// }
	},
	globalData: {
		schedule: [
			{
				roomId: 9,
				liveStatus: '已结束',
				timestamp: 1585903853883
			}
		]
	}
})
