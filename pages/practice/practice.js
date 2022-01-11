import { getTeacherList, queryVideoCourseListByBuyTag } from "../../api/course/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		specials: [
			{title: "线下培训", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795859JmKSKC.jpg", link: "/pages/shopSubject/shopSubject"},
			{title: "直播课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795903cIqsee.jpg", link: "/pages/channelLive/channelLive"},
			{title: "精品课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795914qdcgAL.jpg", link: "/subCourse/qualityCourse/qualityCourse"},
			{title: "免费课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795927rzASqb.jpg", link: "/subCourse/freeOnlineCourse/freeOnlineCourse"},
		],
		teachers: [],
		historyActivities: [
			{type: 1, title: "校友活动", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799298XQtCDM.jpg", link: ""},
			{type: 1, title: "校友活动", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799309bqfggg.jpg", link: ""},
			{type: 2, title: "乐活课堂", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799198EXiDKp.jpg", link: ""},
			{type: 3, title: "游学课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799319IWuDsW.jpg", link: ""},
		],
		qualityList: []
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
	run() {
		// 获取讲师列表
		getTeacherList({offset: 0, limit: 3})
			.then(({data: {list}}) => {
				list = list || []
				list = list.map((n => ({
						...n,
						avatar: n.photo_wall.split(",")[0]
					})
				))
				this.setData({teachers: list})
			})

		// 获取精品课程
		queryVideoCourseListByBuyTag({offset: 0, limit: 3}).then(list => {
			list = list || []
			list = list.map(_ => {
				return {
					..._.kecheng_series,
					teacher: _.teacher,
					didBought: _.buy_tag === "已购",
					buy_tag: _.buy_tag
				}
			})
			let handledList = list.map((res) => {
				if (res.visit_count >= 10000) {
					res.visit_count = (res.visit_count / 10000).toFixed(1) + "万"
					res.visit_count = res.visit_count.split('.')[1] === '0万' ? res.visit_count[0] + "万" : res.visit_count
				}
				res.price = (res.price / 100) // .toFixed(2)
				if (res.discount_price === -1 && res.price > 0) {
					// 原价出售
					// 是否有营销活动
					if (+res.invite_open === 1) {
						res.fission_price = (+res.price * res.invite_discount / 10000) // .toFixed(2)
					}
				} else if (res.discount_price >= 0 && res.price > 0) {
					// 收费但有折扣
					res.discount_price = (res.discount_price / 100) // .toFixed(2)
					// 是否有营销活动
					if (+res.invite_open === 1) {
						res.fission_price = (+res.discount_price * res.invite_discount / 10000) // .toFixed(2)
					}
				} else if (+res.discount_price === -1 && +res.price === 0) {
					res.discount_price = 0
				}

				// 只显示开启营销活动的数据
				if (+res.invite_open === 1 && (res.price > 0 || res.discount_price > 0)) {
					res.tipsText = res.fission_price == 0 ? "邀好友免费学" : `邀好友${(res.invite_discount / 10)}折购`
				}

				return res
			})
			this.setData({qualityList: handledList})
		})
	},

	// 处理特色课程点击
	onSpecialItemTap(e) {
		let {item} = e.currentTarget.dataset
		wx.navigateTo({url: item.link})
	},

	// 打开师资列表
	goToTeacherListPage() {
		wx.navigateTo({url: "/teacherModule/teacherList/teacherList"})
	},

	// 查看老师信息
	onTeacherTap(e) {
		let {item} = e.currentTarget.dataset
		wx.navigateTo({url: "/teacherModule/index/index?id=" + item.id})
	},

	// 打开精品课程
	onCourseItemTap(e) {
		let {item} = e.currentTarget.dataset
		wx.navigateTo({url: `/subCourse/videoCourse/videoCourse?videoId=${item.id}`})
	},

	// 打开精品课程
	goToQualityListPage() {
		wx.navigateTo({url: "/subCourse/qualityCourse/qualityCourse"})
	},

	// 打开过往活动
	onHistoryActivityTap(e) {
		let {item} = e.currentTarget.dataset
		wx.navigateTo({url: item.link})
	}
})
