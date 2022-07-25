import { getMindfulnessList } from "../../api/mindfulness/index";
import bxPoint from "../../utils/bxPoint";

Page({

  /**
   * 页面的初始数据
   */
  data: {
		list: [],
		// frequency: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}
		this.run()

		bxPoint("mindfulness_practice_page", {})
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
		return {
			title: "花样正念练习"
		}
  },

	run() {
		this.getList()
		// this._catchScreenFrequency()
	},

	getList() {
		getMindfulnessList().then((data) => {
			data = data || []
			data = data.map((item) => {
				let dt = item.duration/60|0
				if (item.duration % 60 >= 45) dt += 1
				return {
					...item,
					dimTime: `${dt}分钟`
				}
			})
			this.setData({list: data})
		})
	},

	goToMindfulness(e) {
		let {item} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/mindfulness/mindfulness?audioId=${item.id}`,
			success() {
				bxPoint("mindfulness_practice_audio_play", {audio_id: item.id}, false)
			}
		})
	},

	// 捕捉屏幕刷新率
	_catchScreenFrequency() {
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
						self.setData({frequency: Number(t2 -t1).toFixed(4)})
						return canvas.cancelAnimationFrame(requestId)
					}
					index += 1
					canvas.requestAnimationFrame(fn)
				}

				requestId = canvas.requestAnimationFrame(fn)
			})
	}
})
