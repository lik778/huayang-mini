// subLive/unAuthorized/unAuthorized.js
import { getAttempt, getAttemptTimes } from "../../api/live/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

	/**
	 * Page initial data
	 */
	data: {
		equityList: [
			{
				pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412187mTUlyw.jpg',
				name: '花样大学\n入学资格',
			},
			{
				pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412211utplVQ.jpg',
				name: '专属活动\n线下派对',
			},
			{
				pic: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586412231IlmZFY.jpg',
				name: '会员专享\n严选商城',
			}
		],
		no: 0
	},
	draw() {
		getAttempt({days: this.data.no, user_id: getLocalStorage(GLOBAL_KEY.userId)}).then(({code, message}) => {
			wx.showModal({
				title: "提示",
				content: code == 0 ? "领取成功" : message,
				confirmText: "确定",
				success() {
					wx.switchTab({url: '/pages/index/index'})
				}
			})
		})
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		getAttemptTimes().then((no) => {
			this.setData({no})
		})
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {

	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	}
})
