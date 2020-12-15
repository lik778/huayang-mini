//app.js
import { getLocalStorage, setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'
import { collectError } from "./api/auth/index"

App({
	onLaunch: function () {
		wx.loadFontFace({
			global: true,
			family: 'Condensed',
			source: 'url("https://huayang-img.oss-cn-shanghai.aliyuncs.com/font/DIN%20Condensed%20Bold.ttf")'
		})
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
			error_code: 400,
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
	}
})
