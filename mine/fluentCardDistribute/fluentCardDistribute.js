import { drawCircleHeadIcon, drawFont, drawImage, drawLine, measureTextWidth } from "../../utils/canvas"
import { getLocalStorage, isIphoneXRSMax, queryWxAuth, toast } from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY, WX_AUTH_TYPE } from "../../lib/config"
import { collectError } from "../../api/auth/index"
import { getFluentLearnInfo, getFluentQrCode } from "../../api/mine/index"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
		bg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612146615YqecUz.jpg",
		logo: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612147817dYEToM.jpg",
		avatar: "",
		nickname: "",
		previewList: [
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612148124KmHnAl.jpg",
				text: "形体学院"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612148147kvOATW.jpg",
				text: "时尚学院"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612148161erGsKD.jpg",
				text: "声乐学院"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612148175AoUadT.jpg",
				text: "品质学院"
			}
		],
		qrcode: "",
		price: 0,
		discount_price: 0,
		bottomNo: 0,
		distributeId: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {inviteId} = options
		this.setData({distributeId: inviteId})
		this.run()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		let isIphoneX = isIphoneXRSMax()
		if (isIphoneX) {
			this.setData({bottomNo: 60})
		}
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
		return {
			title: '花样大学畅学卡，精彩课程，随时随地，想看就看',
			path: `/mine/joinFluentLearn/joinFluentLearn?inviteId=${this.data.distributeId}`
		}
	},
	run() {
		let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
		this.setData({nickname: userInfo.nickname, avatar: userInfo.avatar_url})
		this.getCodeImage()

		getFluentLearnInfo().then(({data: { price, discount_price }}) => {
			this.setData({discount_price: discount_price/100, price: price/100})
		})
	},
	/**
	 * 获取小程序码
	 */
	getCodeImage() {
		getFluentQrCode({user_snow_id: this.data.distributeId}).then(({data}) => {
			this.setData({qrcode: data})
		})
	},
	/**
	 * 保存到相册
	 */
	saveToLocalAlbum() {
		this.generateCanvas().then()
	},
	/**
	 * 生成Canvas
	 */
	async generateCanvas() {
		let ctx = wx.createCanvasContext('fluentCard')
		ctx.scale(3, 3)
		// 背景
		await drawImage(ctx, this.data.bg, 0, 0, 286, 509)
		// logo
		await drawImage(ctx, this.data.logo, 88, 31, 121, 19)
		// 用户信息
		await drawCircleHeadIcon(ctx, this.data.avatar, 54, 106, 24)
		await drawFont(ctx, this.data.nickname, '#000000', "400", "PingFangSC", 16, 90, 86)
		await drawFont(ctx, "和我一起畅学花样大学", '#000000', "500", "PingFangSC", 16, 90, 110)
		// 介绍
		await drawFont(ctx, "花样大学", '#765534', "400", "PingFangSC", 14, 30, 155)
		await drawFont(ctx, "上海首家获批线上老年大学", '#765534', "400", "PingFangSC", 14, 30, 176)
		for (let i = 0; i < 4; i++) {
			await drawImage(ctx, this.data.previewList[i].image, 30 + 59 * i, 216, 50, 60)
			await drawFont(ctx, this.data.previewList[i].text, '#000000', "400", "PingFangSC", 10, 35 + 59 * i, 284)
		}
		await drawFont(ctx, "加入花样大学即享多门类专业课程！", '#765534', "400", "PingFangSC", 14, 30, 317)
		await drawFont(ctx, "更有精彩线下团队活动等你参加！", '#765534', "400", "PingFangSC", 14, 30, 338)
		// 售价
		await drawFont(ctx, "限时特价", '#000000', "400", "PingFangSC", 14, 35, 419 + 8)
		ctx.font = '14px PingFang SC'
		let text01Width = measureTextWidth(ctx, "限时特价")
		await drawFont(ctx, this.data.discount_price, '#CC0000', "400", "PingFangSC", 24, 35 + text01Width, 419)
		ctx.font = '24px PingFang SC'
		let text02Width = measureTextWidth(ctx, "188")
		await drawFont(ctx, "元/年", '#000000', "400", "PingFangSC", 14, 35 + text01Width + text02Width, 419 + 8)
		await drawFont(ctx, `原价${this.data.price}元/年`, 'rgba(0,0,0, 0.5)', "400", "PingFangSC", 12, 35, 452)
		await drawLine(ctx, 'rgba(0,0,0, 0.5)', 1, 35, 460, 35 + 76, 460)
		await drawCircleHeadIcon(ctx, this.data.qrcode, 185 + 33, 408 + 33, 33)
		ctx.draw(false, () => {
			this._saveCanvasImageToLocal("fluentCard")
				.then(({tempFilePath, errMsg}) => {
					console.log(errMsg)
					if (errMsg === "canvasToTempFilePath:ok") {
						queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum)
							.then(() => {
								wx.saveImageToPhotosAlbum({
									filePath: tempFilePath,
									success(res) {
										toast('图片保存成功', 3000, 'success')
									},
									fail(err) {
										collectError({
											level: ErrorLevel.p1,
											page: "dd.actionPost.saveImageToPhotosAlbum",
											error_code: 400,
											error_message: err
										})
										toast('图片保存失败')
									}
								})
							})
							.catch(() => {
								wx.showModal({
									title: '相册授权',
									content: '保存失败，未获得您的授权，请前往设置授权',
									confirmText: '去设置',
									confirmColor: '#33c71b',
									success(res) {
										if (res.confirm) {
											wx.openSetting()
										}
									}
								})
							})
					}
				})
				.catch((err) => {
					console.error(err)
				})
		})
		return true
	},
	// 保存canvas图片到本地
	_saveCanvasImageToLocal(canvasId, x = 0, y = 0, fileType = 'png') {
		return new Promise((resolve, reject) => {
			wx.canvasToTempFilePath({
				x,
				y,
				width: 858,
				height: 1527,
				canvasId,
				fileType,
				success(result) {
					resolve(result)
				},
				fail(err) {
					reject(err)
				}
			})
		})
	},
})
