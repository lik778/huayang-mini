import request from "../../lib/request"
import { getLocalStorage, hasAccountInfo, toast } from "../../utils/util"
import { getNewYearList, saveNewYearFlag } from "../../api/others/index"
import { GLOBAL_KEY } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		parentShareId: "",
		historyFlagAnimate: {},
		runHistoryFlagAnimate: true,
		timer: null,
		historyFlags: [
			"2022年，玲要学会跳一支民族舞，争取加入花样艺术团",
			"2022年，芳芳要每周跑步三次，每次五公里",
			"2022年，平安是福要每周读一本书",
			"2022年，彩云要参加花样模特大赛拿名次",
			"2022年，玫瑰要和小姐们一起去新疆玩",
		],
		selectedImageUrl: "",
		selectedSlogan: "",
    didShowAuth: false,
		lock: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {parentShareId, scene} = options
		console.log('parentShareId = ', parentShareId);
		console.log('scene = ', scene);
		if (scene) {
			// 通过二维码进入
			this.setData({parentShareId: scene})
		} else if (parentShareId) {
			// 通过小程序卡片进入
			this.setData({parentShareId})
		}
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
		if (!this.data.runHistoryFlagAnimate) {
			this.setData({runHistoryFlagAnimate: true})
		}
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
		clearInterval(this.data.timer)
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
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		let path = "/others/newYearFlag/newYearFlag"
		if (userId) path = `${path}?parentShareId=${userId}`
		return {
			title: '2022年 花样陪你一起立个不一样的新年成长目标，赶快点击参与吧',
			path,
			imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639709889ShXQKu.jpg"
		}
	},

	run() {
		getNewYearList({offset: 0, limit: 100})
			.then(({data: {list}}) => {
				let od = this.data.historyFlags.slice()
				let nd = list.map(n => `2022年，${n.username}要${n.slogan}`)
				this.setData({historyFlags: [...od, ...nd]})
				wx.nextTick(() => {
					// 启动动画
					this.createHistoryFlagsAnimate()
				})
			})
	},

	// flags展示动画
	createHistoryFlagsAnimate() {
		let animateCls = wx.createAnimation({
			duration: 60 * 10,
			timingFunction: "linear",
		})

		const query = wx.createSelectorQuery()
		let self = this
		query.select('#history-flag-item').boundingClientRect(function(res){

			let cur = 1
			let offsetH = res.height
			let timer = setInterval(() => {
				if (cur > self.data.historyFlags.length - 4) {
					let od = self.data.historyFlags.slice()
					self.setData({historyFlags: [...od, ...od]})
				}
				wx.nextTick(() => {
					animateCls.translateY(-offsetH * cur).step()
					if (self.data.runHistoryFlagAnimate) cur++
					self.setData({historyFlagAnimate: animateCls.export()})
				})
			}, 3 * 1000)
			self.setData({timer})

		})
		query.exec()
	},
	// 选择图片
	choosePhoto() {
		let self = this
		let hideLoadingFn = () => {
			let t = setTimeout(() => {
				wx.hideLoading()
				clearTimeout(t)
			}, 1000)
		}
		wx.chooseImage({
			count: 1,
			// sizeType: ['original'],
			sizeType: ['compressed'],
			sourceType: ['album'],
			success(res) {
				let {tempFilePaths} = res
				wx.showLoading({title: "上传中...", mask: true})
				self.uploadFileToWxService(tempFilePaths[0])
					.then((data) => {
						self.setData({selectedImageUrl: data})
						hideLoadingFn()
					})
					.catch(() => {
						hideLoadingFn()
					})
			},
		})
	},
	// 上传本地文件到微信服务器
	uploadFileToWxService(filePath) {
		return new Promise((resolve, reject) => {
			wx.uploadFile({
				url: `${request.baseUrl}/hy/wx/applets/image/upload`,
				filePath,
				name: "hyimage",
				success(res) {
					let {data} = JSON.parse(res.data)
					resolve(data)
				},
				error(err) {
					let {message} = JSON.parse(err)
					reject(message)
				}
			})
		})
	},
	onInputChange(e) {
		let slogan = e.detail.value
		this.setData({selectedSlogan: slogan})
	},
  // 生成海报
  generatePost() {
		// 校验flag、图片
		if (!this.data.selectedSlogan) {
			return toast("请输入您的新年成长目标")
		} else if (this.data.selectedSlogan.length > 18) {
			return toast("新年目标建议不超过18个汉字")
		} else if (!this.data.selectedImageUrl) {
			return toast("请上传一张美照，以制作新年海报")
		}
    // 鉴权
    if (!hasAccountInfo()) return this.setData({didShowAuth: true})

		// lock
		if (this.data.lock) return false
		this.setData({lock: true})

		let account = getLocalStorage(GLOBAL_KEY.accountInfo)
		let { nick_name, id } = JSON.parse(account)
		saveNewYearFlag({
			user_id: id,
			username: nick_name,
			slogan: this.data.selectedSlogan,
			sharer_id: this.data.parentShareId
		}).then(({data}) => {
			let self = this
			wx.navigateTo({
				url: "/others/newYearFlagPost/newYearFlagPost",
				events: {
					resetParams() {
						self.setData({
							selectedImageUrl: "",
							selectedSlogan: "",
						})
					}
				},
				success(res) {
					res.eventChannel.emit('acceptDataFromNewYearFlagPage', {
						qrcodeUrl: data,
						coverUrl: self.data.selectedImageUrl,
						slogan: self.data.selectedSlogan
					})
					self.setData({runHistoryFlagAnimate: false})
				}
			})
			this.setData({lock: false})
		}).catch(() => {
			this.setData({lock: false})
		})
  },
  // 用户确认授权
  authCompleteEvent() {
    this.setData({
      didShowAuth: false,
    })
		this.generatePost()
  },
  // 用户授权取消
  authCancelEvent() {
    this.setData({
      didShowAuth: false
    })
  },
})
