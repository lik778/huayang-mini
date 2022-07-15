import { getMindfulnessList } from "../../api/mindfulness/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
		list: [],
		frequency: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this.run()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

	run() {
		this.getList()
		this._getScreenFrequency()
	},

	getList() {
		getMindfulnessList().then((data) => {
			data = data || []
			data = data.map((item) => ({
				...item,
				dimTime: `${item.duration/60|0}分钟`
			}))
			this.setData({list: data})
		})
	},

	goToMindfulness(e) {
		let {item} = e.currentTarget.dataset
		let self = this
		wx.navigateTo({
			url: "/pages/mindfulness/mindfulness",
			success(res) {
				res.eventChannel.emit("transmitData", JSON.stringify({...item, frequency: self.data.frequency}))
			}
		})
	},

	_getScreenFrequency() {
		const query = wx.createSelectorQuery()
		let self = this
		query.select('#test')
			.fields({node: true, size: true})
			.exec(async (res) => {
				const canvas = res[0].node
				let requestId = 0
				let index = 0
				let t1 = 0
				let t2 = 0

				let fn = (t) => {
					switch (index) {
						case 1: {
							t1 = t
							break
						}
						case 2: {
							t2 = t
							break
						}
					}
					if (index >= 2) {
						self.setData({frequency: Number(t2 -t1).toFixed(2)})
						return canvas.cancelAnimationFrame(requestId)
					}
					index += 1
					canvas.requestAnimationFrame(fn)
				}

				requestId = canvas.requestAnimationFrame(fn)
			})
	}
})
