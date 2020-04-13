// subLive/review/review.js
import { getLiveInfo } from "../../api/live/course"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		zhiboRoomInfo: {}
	},
	haveMore() {
		const type = this.data.zhiboRoomInfo.zhibo_room.room_type
		const officialRoomId = this.data.zhiboRoomInfo.zhibo_room.user_id
		if (type === 'kecheng') {
			wx.redirectTo({
				url: `/subLive/courseList/courseList?id=${officialRoomId}`,
			})
		} else {
			wx.switchTab({
				url: '/pages/live/live'
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function ({zhiboRoomId}) {
		getLiveInfo({zhibo_room_id: zhiboRoomId}).then((response) => {
			this.setData({
				zhiboRoomInfo: { ...response }
			})
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})
