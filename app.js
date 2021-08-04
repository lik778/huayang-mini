import {
	getLocalStorage,
	hasAccountInfo,
	removeLocalStorage,
	setLocalStorage,
	setWxUserInfoExpiredTime
} from './utils/util'
import { GLOBAL_KEY } from './lib/config'
import { collectError } from "./api/auth/index"
import dayjs from "dayjs"

App({
	onLaunch: function () {
		wx.loadFontFace({
			global: true,
			family: 'Condensed',
			source: 'url("https://huayang-img.oss-cn-shanghai.aliyuncs.com/font/DIN%20Condensed%20Bold.ttf")'
		})

		// 每次打开小程序执行一次
		if (hasAccountInfo()) {
			let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo) || null)
			// 检查用户本地账户信息是否存在snow_id，不存在则清除本地账户相关数据
			if (!accountInfo.snow_id) {
				removeLocalStorage(GLOBAL_KEY.accountInfo)
			}

			// 检查用户本地账户信息中的snow_id类型是否为数字类型，是则删除本地账户数据，授权获取字符类型snow_id
			else if (typeof accountInfo.snow_id === "number") {
				removeLocalStorage(GLOBAL_KEY.accountInfo)
			}
		}

		// 小程序版本更新
		if (wx.canIUse('getUpdateManager')) {
			let updateManage = wx.getUpdateManager()
			updateManage.onCheckForUpdate((res) => {
				// 有新版本
				if (res.hasUpdate) {
					console.log("您好，小程序已有新版本")
				}
			})
			// 开始下载更新
			updateManage.onUpdateReady(() => {
				wx.showModal({
					title: "更新提示",
					content: "新版本已经准备好，是否马上重启小程序？",
					success: (res) => {
						if (res.confirm) {
							// 用户同意更新
							updateManage.applyUpdate()
						}
					}
				})
			})
			//下载更新失败
			updateManage.onUpdateFailed(() => {
				wx.showModal({
					title: '程序版本更新通知',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开'
				})
			})
		}
		// wx.getLocation({
		// 	type: 'wgs84',
		// 	isHighAccuracy:true,
		// 	success (res) {
		// 		const latitude = res.latitude
		// 		const longitude = res.longitude
		// 		const speed = res.speed
		// 		const accuracy = res.accuracy
		// 		console.log(res)
		// 	}
		//  })
		//  "permission": {
		// 	"scope.userLocation": {
		// 		"desc": "你的位置信息将用于小程序为您提供更好的服务"
		// 	}
		// },
	},
	onShow(options) {
		// 记录设备信息，保证进入详情页时可以获取到statusHeight自定义navibar
		if (!getLocalStorage(GLOBAL_KEY.systemParams)) {
			wx.getSystemInfo({
				complete: (res) => {
					setLocalStorage(GLOBAL_KEY.systemParams, res)
				},
			})
		}

		// 检查用户微信授权有效期
		let expireTime = getLocalStorage(GLOBAL_KEY.userInfoExpireTime)

		if (expireTime) {
			let didExpired = dayjs(expireTime).isBefore(dayjs())
			if (didExpired) {
				removeLocalStorage(GLOBAL_KEY.openId)
				removeLocalStorage(GLOBAL_KEY.userInfo)
				removeLocalStorage(GLOBAL_KEY.userInfoExpireTime)
				removeLocalStorage(GLOBAL_KEY.userId)
				removeLocalStorage(GLOBAL_KEY.token)
				removeLocalStorage(GLOBAL_KEY.accountInfo)
			}
		} else {
			setWxUserInfoExpiredTime()
		}

		// 将"口令"包文件至本地缓存文件
		// wx.getSavedFileList({
		// 	success(res) {
		// 		if (res.errMsg === "getSavedFileList:ok") {
		// 			console.log('savedFilesSize = ' + res.fileList.length);
		// 			// return
		// 			if (res.fileList.length !== 13) {
		// 				// 清理所有本地缓存文件
		// 				batchRemoveSavedFiles(res.fileList).then(() => {
		// 					// 批量下载"口令"包
		// 					batchDownloadFiles(voices_ary).then((response) => {
		// 						batchSaveFiles(response).then((ary) => {
		// 							console.log(ary);
		// 						})
		// 					})
		// 				})
		// 			}
		// 		}
		// 	}
		// })
	},
	onUnload() {},
	onHide() {
		// 小程序退出前清除提醒弹窗记录
		this.globalData.didSendRemindWithUserId = false
	},
	onError(error) {
		collectError({
			page: "app.js",
			error_code: 300,
			error_message: error
		})
	},
	globalData: {
		didSendRemindWithUserId: false, // 是否携带userId调用过弹窗接口
		firstViewPage: "", // 用户打开的第一个页面地址
		didVisibleCooPenPage: false, // 是否已经展示过开屏页
		super_user_id: 0, // 上级邀请人id
		source: "", // 用户场景来源
		needInitialPageName: "", // 需要重新加载的页面  [ 综合作业广场｜主题作业广场 ]
		didShowedTaskTip: false, // 是否已经展示过作业提示
		discoveryToPracticeTabIndex: undefined, // 首页金刚位跳转
		showContactEnterTime:"2021-08-04 20:00:00"
	}
})
