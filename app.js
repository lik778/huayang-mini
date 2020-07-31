//app.js
import { batchDownloadFiles, getLocalStorage, setLocalStorage } from './utils/util'
import { GLOBAL_KEY } from './lib/config'
import { v48 } from "./lib/voices"

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
					if (res.fileList.length === 0) {
						return ;
						// 批量下载"口令"包
						batchDownloadFiles(v48).then((response) => {

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
