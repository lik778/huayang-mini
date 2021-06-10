import { hasAccountInfo, hasUserInfo, toast } from "../../utils/util"
import { collectError } from "../../api/auth/index"
import { ErrorLevel } from "../../lib/config"
import request from "../../lib/request"
import { uploadBookServiceResource } from "../../api/bookService/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		didShowAuth: false,
		magazineId: 0,
		// cover: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689BCllur.png",
		cover: "",
		// backCover: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689dgVoGT.png",
		backCover: "",
		// contentImgs: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689BCllur.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689dgVoGT.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689jEdfTq.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689njZKFd.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689zWunRy.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689PWMVqk.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689goBVpN.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540689XooLca.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979kzrwjt.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979URMJQa.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979HkliNC.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979mnaOJF.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979rmPpiA.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979zHugJQ.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979IAdTrp.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540979PKogTR.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985WgTJxm.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985UoKfWm.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985RoUCUR.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985UKaXXl.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985KdNthF.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985fNqOQZ.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540985gUqMhb.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540999AUtHZy.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540999bFwPmc.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622540999mgPlOp.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622541000ghKUYx.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622541000kSbRmq.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622796401DHWuVc.png", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1622796407uBErAT.png"],
		contentImgs: [],
		CONTENT_IMAGE_MAX_COUNT: 31,
		scrollTopNo: 0,
		dingOffsetNo: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {id} = options
		if (id) {
			this.setData({magazineId: id})
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

	onPageScroll(e) {
		this.setData({scrollTopNo: e.scrollTop})
	},

	// 启动函数
	run() {
		let self = this
		// 检查用户授权
		this.setData({didShowAuth: !hasUserInfo() || !hasAccountInfo()})
		// 获取DING偏移高度
		let domQuery = wx.createSelectorQuery()
		domQuery.select("#ding").boundingClientRect()
		domQuery.exec(function (res) {
			self.setData({
				dingOffsetNo: res[0].top - 21
			})
		})
	},
	// 选择照片
	chooseImg(count = 1) {
		let self = this
		return new Promise((resolve, reject) => {
			wx.chooseImage({
				count,
				sizeType: ['original'],
				sourceType: ['album'],
				success(res) {
					wx.showLoading({title: '图片上传中...', mask: true})
					let {tempFilePaths} = res
					let promiseArray = tempFilePaths.map((tempFilePath) => self.uploadFileToWxService(tempFilePath))
					Promise.all(promiseArray).then((images) => {
						resolve(images)
					})
				},
				fail(err) {
					collectError({
						level: ErrorLevel.p1,
						page: 'dd.bookUpload.chooseImage',
						error_code: 400,
						error_message: err
					})
					reject(err)
				}
			})
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
					collectError({
						level: ErrorLevel.p1,
						page: 'dd.bookUpload.uploadFile',
						error_code: 400,
						error_message: err
					})
					let {message} = JSON.parse(err)
					reject(message)
				}
			})
		})
	},
	// 预览图片
	previewImg(urls, current = "") {
		urls = urls.map(u => u + "?x-oss-process=style/huayang")
		current += "?x-oss-process=style/huayang"
		wx.previewImage({urls, current})
	},
	chooseCover() {
		this.chooseImg().then((imageUrls) => {
			if (imageUrls.length > 0) {
				this.setData({cover: imageUrls[0]})
			}
			wx.hideLoading()
		}).catch(() => {
			wx.hideLoading()
		})
	},
	previewCover() {
		this.previewImg([this.data.cover])
	},
	removeCover() {
		this.setData({cover: ""})
	},
	chooseBackCover() {
		this.chooseImg().then((imageUrls) => {
			if (imageUrls.length > 0) {
				this.setData({backCover: imageUrls[0]})
			}
			wx.hideLoading()
		}).catch(() => {
			wx.hideLoading()
		})
	},
	previewBackCover() {
		this.previewImg([this.data.backCover])
	},
	removeBackCover() {
		this.setData({backCover: ""})
	},
	chooseContentImgs() {
		this.chooseImg(this.data.CONTENT_IMAGE_MAX_COUNT - this.data.contentImgs.length)
			.then((imageUrls) => {
				this.setData({contentImgs: [...this.data.contentImgs, ...imageUrls]})
				wx.hideLoading()
			})
			.catch(() => {
				wx.hideLoading()
			})
	},
	previewContentImg(e) {
		let targetUrl = e.currentTarget.dataset.item
		this.previewImg(this.data.contentImgs, targetUrl)
	},
	removeContentImg(e) {
		let targetUrl = e.currentTarget.dataset.item
		this.setData({contentImgs: this.data.contentImgs.slice().filter(n => n !== targetUrl)})
	},
	upload() {
		if (!hasUserInfo() || !hasAccountInfo()) return this.setData({didShowAuth: true})

		if (!this.data.magazineId) return toast("小程序码错误，请联系客服人员")
		if (!this.data.cover) return toast("请上传封面图片")
		if (!this.data.backCover) return toast("请上传封底图片")
		if (this.data.contentImgs.length < this.data.CONTENT_IMAGE_MAX_COUNT) return toast(`请再上传${this.data.CONTENT_IMAGE_MAX_COUNT - this.data.contentImgs.length}张内页图片`)

		let pagePicData = this.generateInnerPageData(this.data.contentImgs)
		uploadBookServiceResource({
			magazine_id: this.data.magazineId,
			cover: this.data.cover,
			back_cover: this.data.backCover,
			page_pic: JSON.stringify(pagePicData)
		}).then(() => {
			wx.redirectTo({url: "/pages/bookCustomSuccess/bookCustomSuccess"})
		})
	},
	// 生成内页数据
	generateInnerPageData(strAry) {
		const Dictionary = [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 1, 2]
		let cloneStrAry = strAry.slice()
		return Dictionary.map((c, index) => {
			let item = {}
			item.page_num = index + 1
			item.detail = []
			for (let i = 0; i < c; i++) {
				item.detail.push({pic: cloneStrAry.shift(), text: ""})
			}
			return item
		})
	},
	// 用户授权取消
	authCancelEvent() {
		this.setData({
			didShowAuth: false
		})
	},
	// 用户确认授权
	authCompleteEvent() {
		this.setData({
			didShowAuth: false
		})
	}
})
