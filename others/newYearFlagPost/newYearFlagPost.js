import { $notNull, getLocalStorage, queryWxAuth, toast } from "../../utils/util"
import { GLOBAL_KEY, WX_AUTH_TYPE } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		eventChannel: {},
		accountInfo: {},
		upperData: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const eventChannel = this.getOpenerEventChannel()
		if ($notNull(eventChannel)) {
			let self = this
			eventChannel.on('acceptDataFromNewYearFlagPage', function(data) {
				self.setData({upperData: data})
			})

			this.setData({eventChannel})
		}

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
		let userId = getLocalStorage(GLOBAL_KEY.userId)
		return {
			title: '2022年 花样陪你一起立个不一样的新年成长目标，赶快点击参与吧',
			path: `/others/newYearFlag/newYearFlag?parentShareId=${userId}`,
			imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639709889ShXQKu.jpg"
		}
	},
	// 启动函数
	run() {
		let accountInfoJSON = getLocalStorage(GLOBAL_KEY.accountInfo)
		if (accountInfoJSON) {
			let info = JSON.parse(accountInfoJSON)
			info.nick_name = info.nick_name.slice(0, 9)
			this.setData({accountInfo: info})
		}
	},
	// 再玩一次
	again() {
		this.data.eventChannel.emit("resetParams")
		wx.navigateBack()
	},
	// 保存海报
	generateCanvas() {
		const query = wx.createSelectorQuery()
		wx.showLoading({title: "海报生成中...", mask: true})
		query.select('#newYearFlagCanvas')
			.fields({node: true, size: true})
			.exec(async (res) => {
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')

				const dpr = wx.getSystemInfoSync().pixelRatio
				canvas.width = res[0].width * dpr
				canvas.height = res[0].height * dpr
				ctx.scale(dpr, dpr)

				// 绘制背景
				ctx.save()
				ctx.fillStyle = "#BC0F17"
				ctx.fillRect(0, 0, 355, 568)
				ctx.restore()

				// 线段1、2
				ctx.fillStyle = "#EBD4B9"
				ctx.rect(15, 435, 325, 1)
				ctx.rect(15, 520, 325, 1)
				ctx.fill()

				// 用户头像
				ctx.save()
				ctx.beginPath()
				ctx.arc(38, 41, 22, 0, 2 * Math.PI)
				ctx.clip()
				let avatarImgRes = await this._loadNetworkImageRes(canvas, this.data.accountInfo.avatar_url,)
				ctx.drawImage(avatarImgRes, 16, 19, 44, 44)
				ctx.restore()

				// 用户昵称
				ctx.font = "800 16px PingFang-SC-Heavy"
				let nickname = `我是${this.data.accountInfo.nick_name}`
				ctx.fillText(nickname, 72, 26 + 15 + 7.5)

				// 主图
				const StandardWidth = 280
				const StandardHeight = 280
				let mainImgInfo = await this._loadNetworkImageInfo(canvas, this.data.upperData.coverUrl, StandardWidth, StandardHeight)
				ctx.drawImage(mainImgInfo.path, (StandardWidth - mainImgInfo.width) / 2 + 38, (StandardHeight - mainImgInfo.height) / 2 + 75, mainImgInfo.width, mainImgInfo.height)

				// 装饰1
				let d1Res = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639640379yJRZFE.jpg",)
				ctx.drawImage(d1Res, 255, 13, 86, 28)

				// 装饰2
				let d2Res = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639640447QGtVoF.jpg",)
				ctx.drawImage(d2Res, 22, 82, 40, 172)

				// 装饰3
				let d3Res = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639640473MjxrLv.jpg",)
				ctx.drawImage(d3Res, 292, 106, 20, 226)

				// 文案1
				ctx.font = "800 17px PingFang-SC-Heavy"
				let text01 = "我的2022年成长目标"
				let text01Width = ctx.measureText(text01).width
				ctx.fillText(text01, 18 + (319 - text01Width) / 2, 376 + 9)

				// 文案2
				let text02 = this.data.upperData.slogan
				let text02Width = ctx.measureText(text02).width
				ctx.fillText(text02, 18 + (319 - text02Width) / 2, 395 + 20)

				// 装饰4
				let d4Res = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639637453ebrsUZ.jpg",)
				ctx.drawImage(d4Res, 17, 453, 153, 51)

				// 提示文案
				ctx.font = "400 12px PingFangSC-Regular"
				let text03 = "长按生成你的"
				let text04 = "2022"
				let text05 = "新年成长愿望"
				ctx.fillText(text03, 180 + 15, 453 + 12)
				ctx.fillText(text04, 180 + 58, 453 + 12 + 17)
				ctx.fillText(text05, 180 + 15, 453 + 12 + 34)

				// 二维码
				if (this.data.upperData.qrcodeUrl) {
					ctx.save()
					ctx.beginPath()
					ctx.arc(309, 478, 32, 0, 2 * Math.PI)
					ctx.clip()
					ctx.fillStyle = "#FFFFFF"
					ctx.fill()
					let qrcodeRes = await this._loadNetworkImageRes(canvas, this.data.upperData.qrcodeUrl,)
					ctx.drawImage(qrcodeRes, 279, 448, 60, 60)
					ctx.restore()
				}

				// 装饰5
				let d5Res = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639640014bmCvDd.jpg",)
				ctx.drawImage(d5Res, 16, 535, 322, 18)

				// 保存海报到相册
				this._saveCanvasImageToLocal(canvas)
					.then(({tempFilePath, errMsg}) => {
						if (errMsg === "canvasToTempFilePath:ok") {
							queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum)
								.then(() => {
									wx.hideLoading()
									wx.saveImageToPhotosAlbum({
										filePath: tempFilePath,
										success(res) {
											toast('图片保存成功', 3000, 'success')
										},
										fail(err) {
											toast('图片保存失败')
										}
									})
								})
								.catch(() => {
									wx.hideLoading()
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
						wx.hideLoading()
					})
			})
	},
	// 保存canvas图片到本地
	_saveCanvasImageToLocal(canvas, x = 0, y = 0, fileType = 'png') {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				wx.canvasToTempFilePath({
					x,
					y,
					width: 355,
					height: 568,
					canvas,
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
	// 读取图片信息
	_loadNetworkImageInfo(canvas, imgUrl, standardWidth, standardHeight) {
		return new Promise((resolve) => {
			wx.getImageInfo({
				src: imgUrl,
				success(res) {
					let img = canvas.createImage()
					img.src = imgUrl
					img.onload = () => {
						let ratio = 1
						if (res.width >= res.height) {
							ratio = standardWidth/res.width
						} else {
							ratio = standardHeight/res.height
						}
						resolve({
							width: res.width * ratio | 0,
							height: res.height * ratio | 0,
							path: img,
						})
					}
				}
			})
		})
	},
	// 加载网络图片
	_loadNetworkImageRes(canvas, imgUrl) {
		return new Promise((resolve) => {
			let img = canvas.createImage()
			img.src = imgUrl
			img.onload = () => {
				resolve(img)
			}
		})
	}
})
