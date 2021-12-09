import { getFindBanner } from "../../api/course/index"
import { $notNull } from "../../utils/util"
import { getYouZanKeChengList } from "../../api/live/index"
import dayjs from "dayjs"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		globalShow: false,
		bannerList: [],
		list: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.run()
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

	},
	// 启动函数
	run() {
		this.getBanner()
		this.getList()
	},
	naviMiniProgram(link, linkType) {
		switch (linkType) {
			case "youzan": {
				// 有赞商城
				wx.navigateToMiniProgram({appId: "wx95fb6b5dbe8739b7", path: link})
				break
			}
			case "travel": {
				// 游学
				wx.navigateToMiniProgram({appId: "wx2ea757d51abc1f47", path: link})
				break
			}
			default: {
				wx.navigateTo({
					url: link, fail() {
						wx.switchTab({url: link})
					}
				})
			}
		}
	},
	// swiper切换
	changeSwiperIndex(e) {
		this.setData({
			current: e.detail.current
		})
	},
	// 处理轮播点击事件
	handleBannerTap(e) {
		let {link, link_type, id} = e.currentTarget.dataset.item
		this.naviMiniProgram(link, link_type)
	},
	// 获取banner图片
	getBanner() {
		getFindBanner({scene: 24}).then((bannerList) => {
			this.setData({bannerList})
		})
	},
	// 获取有赞培训课数据
	getList() {
		getYouZanKeChengList({offset: 0, limit: 999})
			.then(({data: {list}}) => {
				list = list || []
				list = list.map(n => ({
					...n,
					price: (n.price / 100).toFixed(0)
				}))
				this.setData({list})
			})
			.finally(() => {
				this.setData({globalShow: true})
			})
	},
	// 唤醒电话
	onPhoneCall() {
		wx.makePhoneCall({
			phoneNumber: "15000961093",
			success() {
			},
			fail() {
			}
		})
	},
	// 跳转到有赞全部培训课列表页
	onMoreTap() {
		wx.navigateToMiniProgram({
			appId: "wx95fb6b5dbe8739b7",
			path: "pages/common/blank-page/index?weappSharePath=pages%2Fhome%2Ffeature%2Findex%3Falias%3DVDcBLnwO4l%26kdt_id%3D43257500",
		})
	},
	// 培训课课程item点击
	onAdsItemTap(e) {
		let {item} = e.currentTarget.dataset
		if (item) {
			wx.navigateToMiniProgram({
				appId: "wx95fb6b5dbe8739b7",
				path: `${item.page_url}?alias=${item.alias}`,
			})
		}
	}
})
