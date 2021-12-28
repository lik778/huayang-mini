import { getUserJoinedActivitiesByMobile } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY, ROOT_URL } from "../../lib/config"
import dayjs from "dayjs"
import request from "../../lib/request"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TAGS: ["全部", "已报名", "已结束"],
		curTagIndex: 1,
		list: [],
		status: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.run()
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
	run() {
		this.getList()
	},
	getList() {
		wx.showLoading({title: '加载中...', mask: true})

		let mobile = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
		let params = {offset: 0, limit: 100, mobile}
		if (this.data.curTagIndex !== 0) params['status'] = this.data.curTagIndex
		getUserJoinedActivitiesByMobile(params)
			.then(({data: list}) => {
				list = list || []
				list = list.map(n => ({
					...n,
					year: dayjs(n.start_time).year(),
					month: dayjs(n.start_time).month() + 1,
				}))
				this.setData({list})
				wx.hideLoading()
			})
			.catch(() => {
				wx.hideLoading()
			})
	},
	onTagTap(e) {
		let {index} = e.currentTarget.dataset
		this.setData({curTagIndex: +index})

		this.getList()
	},
	goToWebview(e) {
		let {item} = e.currentTarget.dataset
		let link = ""
		switch (request.baseUrl) {
			case ROOT_URL.dev: {
				link = 'https://dev.huayangbaixing.com'
				break
			}
			case ROOT_URL.prd: {
				link = 'https://huayang.baixing.com'
				break
			}
		}

		link += `/#/home/detail/${item.id}`
		wx.navigateTo({url: `/pages/pureWebview/pureWebview?link=${link}`})
	},
	goToActivitiesPage() {
		wx.navigateTo({url: "/pages/activities/activities"})
	}
})
