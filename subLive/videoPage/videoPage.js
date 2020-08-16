import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		link: "",
		adapter: false
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({link: options.link})
		let res = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
		this.setData({
			adapter: /iphone x/i.test(res.model) || /iPhone11/i.test(res.model)
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
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

	}
})
