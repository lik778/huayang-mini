Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		specials: [
			{ title: "线下培训", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795859JmKSKC.jpg" },
			{ title: "直播课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795903cIqsee.jpg" },
			{ title: "精品课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795914qdcgAL.jpg" },
			{ title: "免费课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641795927rzASqb.jpg" },
		],
		historyActivities: [
			{ type: 1, title: "校友活动", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799298XQtCDM.jpg" },
			{ type: 1, title: "校友活动", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799309bqfggg.jpg" },
			{ type: 2, title: "乐活课堂", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799198EXiDKp.jpg" },
			{ type: 3, title: "游学课程", url: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1641799319IWuDsW.jpg" },
		]
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
	}
})
