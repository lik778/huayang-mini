import { drawBorderCircle, drawCircleHeadIcon, drawFont, drawImage, measureTextWidth } from "../../utils/canvas"
import {
	calcStringLen,
	getLocalStorage,
	isIphoneXRSMax,
	queryWxAuth,
	splitTargetNoString,
	toast
} from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY, WX_AUTH_TYPE } from "../../lib/config"
import { collectError } from "../../api/auth/index"
import { getFluentLearnInfo, getFluentQrCode } from "../../api/mine/index"
import bxPoint from "../../utils/bxPoint"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
		bg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612146615YqecUz.jpg",
		logo: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1612147817dYEToM.jpg",
		comma01: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1614164632gVVvYN.jpg",
		comma02: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1614164636uBajQv.jpg",
		avatar: "",
		nickname: "",
		previewList: [
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795678iYbowi.jpg",
				text: "品质生活"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795682SVxayP.jpg",
				text: "时尚潮流"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795692HwYOyV.jpg",
				text: "兴趣爱好"
			},
			{
				image: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795698AltZXv.jpg",
				text: "模特训练"
			}
		],
		permissionList: [
			{
				icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795720FvzYdk.jpg",
				text01: "全年畅学",
				text02: "线上课程"

			},
			{
				icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795712nabBBP.jpg",
				text01: "每月组织",
				text02: "校友活动"
			},
			{
				icon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618795707BlnIDa.jpg",
				text01: "线上线下",
				text02: "精品课程"
			}
		],
		qrcode: "",
		price: 0,
		discount_price: 0,
		bottomNo: 0,
		distributeId: 0,
		saveLock: false
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
		bxPoint("changxue_post", {})
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
			title: '课程全解锁，一卡学全年',
			path: `/mine/joinFluentLearn/joinFluentLearn?inviteId=${this.data.distributeId}`
		}
	},
	/**
	 * 分享给好友
	 */
	shareToFriend() {
		bxPoint("changxue_post_share", {}, false)
	},
	run() {
		let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
		this.setData({nickname: userInfo.nickname, avatar: userInfo.avatar_url})
		this.getCodeImage()

		getFluentLearnInfo().then(({data: {price, discount_price}}) => {
			this.setData({discount_price: discount_price / 100, price: price / 100})
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
		bxPoint("changxue_post_save", {}, false)

		wx.showLoading({
			title: '海报生成中...',
			mask: true
		})

		if (this.data.saveLock) return
		this.setData({saveLock: true})
		let t = setTimeout(() => {
			this.setData({saveLock: false})
			clearTimeout(t)
		}, 500)

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
		await drawImage(ctx, this.data.comma01, 90, 86 - 20, 17, 14)
		await drawFont(ctx, calcStringLen(this.data.nickname) > 16 ? `我是${splitTargetNoString(this.data.nickname, 16)}..` : `我是${this.data.nickname}`, '#000000', "400", "PingFangSC", 14, 90, 86)
		await drawFont(ctx, "和我一起加入花样老年大学吧!", '#000000', "500", "PingFangSC", 14, 90, 110)
		ctx.font = '14px PingFang SC'
		let title01Width = measureTextWidth(ctx, "和我一起加入花样老年大学吧") - 12
		await drawImage(ctx, this.data.comma02, 90 + title01Width, 110 + 20, 17, 14)
		// 介绍
		await drawFont(ctx, "花样老年大学", '#765534', "400", "PingFangSC", 14, 30, 155)
		await drawFont(ctx, "上海首批政府授牌线上老年大学", '#765534', "400", "PingFangSC", 14, 30, 176)
		for (let i = 0; i < 4; i++) {
			await drawImage(ctx, this.data.previewList[i].image, 30 + 59 * i, 216, 50, 60)
			await drawFont(ctx, this.data.previewList[i].text, '#000000', "400", "PingFangSC", 10, 35 + 59 * i, 284)
		}
		await drawFont(ctx, "加入花样老年大学，即享", '#765534', '500', 'PingFangSC', 14, 30, 323)
		await drawFont(ctx, "3", '#DEA265', '700', 'PingFangSC', 24, 200-15, 316)
		await drawFont(ctx, "大权益", '#765534', '500', 'PingFangSC', 14, 215-13, 323)
		for (let i = 0; i < 3; i++) {
			await drawImage(ctx, this.data.permissionList[i].icon, 28 + 84 * i, 356, 20, 20)
			await drawFont(ctx, this.data.permissionList[i].text01, '#000000', "400", "PingFangSC", 10, 51 + 84 * i, 354)
			await drawFont(ctx, this.data.permissionList[i].text02, '#000000', "400", "PingFangSC", 10, 51 + 84 * i, 354 + 14)
		}
		// 售价
		await drawFont(ctx, "限时特价", '#000000', "400", "PingFangSC", 14, 35, 419 + 8 + 12)
		ctx.font = '14px PingFang SC'
		let text01Width = measureTextWidth(ctx, "限时特价")
		await drawFont(ctx, this.data.discount_price, '#CC0000', "400", "PingFangSC", 24, 35 + text01Width, 419 + 12)
		ctx.font = '24px PingFang SC'
		let text02Width = measureTextWidth(ctx, "365")
		await drawFont(ctx, "元/年", '#000000', "400", "PingFangSC", 14, 35 + text01Width + text02Width, 419 + 8 + 12)
		// await drawFont(ctx, `原价${this.data.price}元/年`, 'rgba(0,0,0, 0.5)', "400", "PingFangSC", 12, 35, 452)
		// await drawLine(ctx, 'rgba(0,0,0, 0.5)', 1, 35, 460, 35 + 76, 460)
		await drawBorderCircle(ctx, this.data.qrcode, 185 + 33, 412 + 33, 36)
		ctx.draw(false, () => {
			wx.hideLoading()
			this._saveCanvasImageToLocal("fluentCard")
				.then(({tempFilePath, errMsg}) => {
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
											page: "dd.fluentCardDistribute.saveImageToPhotosAlbum",
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
			setTimeout(() => {
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
			}, 100)
		})
	},
})
