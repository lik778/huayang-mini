import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { getFindBanner } from "../../api/course/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: 0,
		countdownNo: 3,
		timer: null,
		cover: "",
		link: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
		})

		getFindBanner({scene: 16}).then((bannerList) => {
			if (bannerList.length > 0) {
				let {pic_url, link} = bannerList[0]
				this.setData({cover: pic_url, link})

				this.data.timer = setInterval(() => {
					if (this.data.countdownNo <= 0) {
						wx.reLaunch({url: '/pages/discovery/discovery'})
						clearTimeout(this.data.timer)
					} else {
						let no = this.data.countdownNo
						this.setData({countdownNo: no - 1})
					}
				}, 1000)

			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		bxPoint("applets_guide", {
			from_uid: getApp().globalData.super_user_id,
			source: getApp().globalData.source
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
	/**
	 * 跳过动画
	 */
	skip() {
		bxPoint("applets_skip", {}, false)
		clearTimeout(this.data.timer)
		wx.reLaunch({
			url: "/pages/discovery/discovery"
		})
	}
})
