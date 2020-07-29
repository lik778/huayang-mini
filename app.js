//app.js
import {
	batchDownloadFiles,
	batchRemoveSavedFiles,
	batchSaveFiles,
	getLocalStorage,
	setLocalStorage
} from './utils/util'
import { GLOBAL_KEY } from './lib/config'
import { voices_ary } from "./lib/voices"

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

		// 将"口令"包文件至本地缓存文件
		wx.getSavedFileList({
			success(res) {
				if (res.errMsg === "getSavedFileList:ok") {
					console.log('savedFilesSize = ' + res.fileList.length);
					// return
					if (res.fileList.length !== 26) {
						// 清理所有本地缓存文件
						batchRemoveSavedFiles(res.fileList).then(() => {
							// 批量下载"口令"包
							batchDownloadFiles(voices_ary).then((response) => {
								batchSaveFiles(response).then((ary) => {
									console.log(ary);
								})
							})
						})
					}
				}
			}
		})
	},
	onUnload() {},
	onHide() {
		// 小程序退出前清除提醒弹窗记录
		this.globalData.didSendRemindWithUserId = false
	},
	globalData: {
		didSendRemindWithUserId: false, // 是否携带userId调用过弹窗接口
	}
})
