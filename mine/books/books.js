import { createMagazineOrder, getMagazineTemplateList, getUserMagazineList } from "../../api/bookService/index"
import { $notNull, getLocalStorage, hasAccountInfo, hasUserInfo, payCertificate } from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"
import { collectError } from "../../api/auth/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		didShowAuth: false,
		didShowContact: false,
		didShowBookModal: false,
		didExecuteBookModalAnimation: false,
		templateList: [],
		magazineList: [],
		selectedTemplateCategory: 1,
		selectedTemplatePrice: 0,
		currentPrice: 0,
		selectedCount: 1,
		didRenew: true,
		didShowFixedButton: false,
		bookPreviewVideo: null,
		isIntroduceVideoPlaying: false,
		renewTarget: null,
		renewMagazineId: 0,
		titleLayerOffsetNo: 0,
		safeHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight
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
		this.data.bookPreviewVideo = wx.createVideoContext("hy-book-introduce", this)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.run()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		if (this.data.didShowBookModal) {
			this.setData({didShowBookModal: false})
		}
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
		return {
			title: "花样联合顶尖杂志社，定制专属您的时尚画册",
			path: "/mine/books/books"
		}
	},
	onPageScroll(options) {
		this.setData({didShowFixedButton: options.scrollTop + this.data.safeHeight - 200 >= this.data.titleLayerOffsetNo})
	},
	run() {
		// 检查用户授权状态
		if (!hasUserInfo() || !hasAccountInfo()) return this.setData({didShowAuth: true})
		// 请求画册模版数据
		getMagazineTemplateList().then(({data}) => {
			data = data.map((n) => ({...n, price: Number(n.price / 100).toFixed(0)}))
			if ($notNull(data)) {
				this.setData({
					templateList: data.slice(),
					currentPrice: data[0].price * this.data.selectedCount,
					selectedTemplatePrice: data[0].price
				})
			}
		})

		// 获取用户画册列表
		getUserMagazineList({
			user_id: getLocalStorage(GLOBAL_KEY.userId),
			offset: 0,
			limit: 999
		}).then(({data}) => {
			data = data || []
			data = data.map(n => ({
				id: n.id,
				magazineId: n.magazine_id,
				cover: n.magazine.cover,
				back_cover: n.magazine.back_cover,
				status: n.status,
			}))
			this.setData({magazineList: data.slice()})

			if (data.length === 0) this.setData({didShowFixedButton: true})

			let t = setTimeout(() => {
				this.initIntroVideoListener()
				clearTimeout(t)
			}, 300)
		}).catch(() => {
			this.setData({didShowFixedButton: true})
		})
	},
	buy() {
		let params = {
			magazine_category: this.data.selectedTemplateCategory,
			user_id: getLocalStorage(GLOBAL_KEY.userId),
			open_id: getLocalStorage(GLOBAL_KEY.openId),
			count: this.data.selectedCount
		}
		if (this.data.renewMagazineId) {
			params["magazine_id"] = this.data.renewMagazineId
		}
		createMagazineOrder(params).then(({data}) => {
			payCertificate({id: data.id, name: "购买花样画册"})
				.then(() => {
					wx.navigateTo({url: "/pages/bookCustomSuccess/bookCustomSuccess"})
				}).catch((err) => {
				if (err.errMsg !== "requestPayment:fail cancel") {
					collectError({
						level: ErrorLevel.p0,
						page: "dd.books.requestPayment",
						error_code: 500,
						error_message: err
					})
				}
			})
		})
	},
	// 显示弹窗
	showBookModal() {
		this.setData({didShowBookModal: true})
		let t = setTimeout(() => {
			this.setData({didExecuteBookModalAnimation: true})
			clearTimeout(t)
		}, 100)
	},
	// 隐藏弹窗
	hideBookModal() {
		this.setData({didRenew: true, renewMagazineId: 0, renewTarget: null, didExecuteBookModalAnimation: false})
		let t = setTimeout(() => {
			this.setData({didShowBookModal: false})
			clearTimeout(t)
		}, 200)
	},
	oncatchtouchmove() {
		return false
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({didShowAuth: false})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.run()
		this.setData({didShowAuth: false})
	},
	// 打开客服消息弹窗
	openContactModal() {
		this.setData({didShowContact: true})
	},
	// 关闭联系客服
	onCloseContactModal() {
		this.setData({didShowContact: false})
	},
	// 监听画册模版选择变化
	onTemplateChange(e) {
		this.setData({selectedCount: 1})
		wx.nextTick(() => {
			let {category, price} = e.currentTarget.dataset.item
			this.setData({
				selectedTemplateCategory: category,
				currentPrice: Number(price * this.data.selectedCount).toFixed(0),
				selectedTemplatePrice: price
			})
		})
	},
	subtract() {
		let no = this.data.selectedCount
		if (no <= 1) return
		no = --no
		this.setData({selectedCount: no})
		wx.nextTick(() => {
			this.setData({currentPrice: Number(this.data.selectedTemplatePrice * this.data.selectedCount).toFixed(0)})
		})
	},
	add() {
		let no = this.data.selectedCount
		this.setData({selectedCount: ++no})
		wx.nextTick(() => {
			this.setData({currentPrice: Number(this.data.selectedTemplatePrice * this.data.selectedCount).toFixed(0)})
		})
	},
	onBookItemTap(e) {
		let target = e.currentTarget.dataset.item
		this.setData({renewTarget: target})
		if (target.status <= 3) {
			this.openContactModal()
		} else {
			this.setData({didRenew: false, renewMagazineId: target.magazineId})
			this.showBookModal()
		}
	},
	// 初始化宣传视频，进入离开可视区域监听事件
	initIntroVideoListener() {
		let self = this
		let collegeOB = wx.createIntersectionObserver()
		collegeOB.relativeToViewport({top: 0, bottom: 0})
			.observe('#hy-book-introduce', res => {
				if (res && res.intersectionRatio > 0) {
					// 进入可视区域
				} else {
					// 离开可视区域
					this.onPauseVideo()
				}
			})

		let query = wx.createSelectorQuery().in(this);
		query.select('.title-01').boundingClientRect(function (res) {
			self.setData({titleLayerOffsetNo: parseInt(res.top)})
		}).exec()
	},
	onPlayVideo() {
		this.data.bookPreviewVideo.play()
		this.setData({isIntroduceVideoPlaying: true})
	},
	onPauseVideo() {
		this.data.bookPreviewVideo.pause()
		this.setData({isIntroduceVideoPlaying: false})
	},
})
