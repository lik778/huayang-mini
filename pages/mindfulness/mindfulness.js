import { getLocalStorage } from "../../utils/util";
import { GLOBAL_KEY } from "../../lib/config";

// 画布大小
const CANVAS_WIDTH = 375
const CANVAS_HEIGHT = 375
// 背景参数
const ORIGIN_X = CANVAS_WIDTH / 2 // 圆心x
const ORIGIN_Y = CANVAS_HEIGHT / 2 // 圆心y
const BG_R = 140 // 背景半径
const BG_LINE_WIDTH = 18 // 背景边框宽度
const BG_IMAGE_X = ORIGIN_X - BG_R // 背景图片x
const BG_IMAGE_Y = ORIGIN_Y - BG_R // 背景图片y
const BG_IMAGE_W = 2 * BG_R // 背景图device width
const BG_IMAGE_H = 2 * BG_R // 背景图device height
// 进度条参数
const PG_LINE_WIDTH = BG_LINE_WIDTH / 2 // 进度条边框宽度
const PG_R = BG_R - (BG_LINE_WIDTH - PG_LINE_WIDTH) / 2 // 进度条半径
const PG_DOT_R = 14 // 进度点半径
const PG_DOT_LINE_WIDTH = 5 // 进度点边框宽度
// 波纹参数
const WAVE_LINE_WIDTH = 1 // 波浪边框宽度
const WAVE_R = PG_R + PG_LINE_WIDTH / 2 - WAVE_LINE_WIDTH / 2 // 波浪半径

// 频率
const frequency = 1000 / 16.6


Page({

  /**
   * 页面的初始数据
   */
  data: {
		statusHeight: 0,

		progressCanvas: null,
		progressCTX: null,
		current: 0,
		bgLineColor: "#8d8d8d",
		progressLineColor: "white",
		didStopProgressAnimate: false,
		didStopWaveAnimate: false,
		didAnimateInit: false,

		bgAudio: null,
		audioLink: "",
		needInitBgAudio: true,
		bgAudioPaused: true,

		operateLock: false, // 快进、倒退操作锁
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this.initAudioResource()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
		this.run()
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
		this.setData({statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight})

		this.initBgCanvas()
		this.initProgressCanvas()
	},

	// 初始化音频播放器 & 下载音频文件
	initAudioResource() {
		wx.showLoading({title: "正在下载音频...", mask: true})
		this._downloadAudio("https://video.huayangbaixing.com/sv/4b9ddaa9-181f6574e6a/4b9ddaa9-181f6574e6a.mp3").then((file) => {
			this.data.audioLink = file
		}).finally(() => {
			wx.hideLoading()
		})
	},

	// 运行动画
	initCanvasAnimate() {
		this.initWaveCanvas()
		this.playProgressAnimate(this.data.bgAudio.duration)
	},

	// 初始化背景
	initBgCanvas() {
		const query = wx.createSelectorQuery()
		query.select('#bgCanvas')
			.fields({node: true, size: true})
			.exec(async (res) => {
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')

				const dpr = wx.getSystemInfoSync().pixelRatio
				canvas.width = res[0].width * dpr
				canvas.height = res[0].height * dpr
				ctx.scale(dpr, dpr)

				ctx.save()
				ctx.beginPath()
				ctx.arc(ORIGIN_X, ORIGIN_Y, BG_R, 0, 2 * Math.PI)
				ctx.clip()
				let avatarImgRes = await this._loadNetworkImageRes(canvas, "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1657272555PYtbbm.jpg")
				ctx.drawImage(avatarImgRes, BG_IMAGE_X, BG_IMAGE_Y, BG_IMAGE_W, BG_IMAGE_H)
				ctx.lineWidth = BG_LINE_WIDTH
				ctx.strokeStyle = this.data.bgLineColor
				ctx.closePath()
				ctx.stroke()
				ctx.restore()
			})
	},

	// 初始化进度条
	initProgressCanvas() {
		let self = this
		const query = wx.createSelectorQuery()
		query.select('#progressCanvas')
			.fields({node: true, size: true})
			.exec(async (res) => {
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')

				const dpr = wx.getSystemInfoSync().pixelRatio
				canvas.width = res[0].width * dpr
				canvas.height = res[0].height * dpr
				ctx.scale(dpr, dpr)

				self.setData({progressCanvas: canvas, progressCTX: ctx})
			})
	},

	// 初始化波纹
	initWaveCanvas() {
		const query = wx.createSelectorQuery()
		query.select('#waveCanvas')
			.fields({node: true, size: true})
			.exec(async (res) => {
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')

				const dpr = wx.getSystemInfoSync().pixelRatio
				canvas.width = res[0].width * dpr
				canvas.height = res[0].height * dpr
				ctx.scale(dpr, dpr)

				// 波纹01
				const max = WAVE_LINE_WIDTH * 1000 / 4 // 控制波纹速度
				let cur = 0
				let cur2 = 0
				let cur3 = 0
				let waveFn = () => {
					ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

					ctx.strokeStyle = "rgba(255,255,255,0.7)"

					// 波纹1
					if (cur >= max) cur = 0
					cur = this.data.didStopWaveAnimate ? cur : cur + 1
					ctx.save()
					ctx.lineWidth = WAVE_LINE_WIDTH * (max - cur + 0.001)/max
					ctx.beginPath()
					ctx.arc(ORIGIN_X, ORIGIN_Y, WAVE_R + cur/max * BG_IMAGE_X, 0, 2 * Math.PI)
					ctx.closePath()
					ctx.stroke()
					ctx.restore()

					// 波纹2
					if (cur2 > 0 || cur >= max / 3) {
						if (cur2 >= max) cur2 = 0
						cur2 = this.data.didStopWaveAnimate ? cur2 : cur2 + 1
						ctx.save()
						ctx.lineWidth = WAVE_LINE_WIDTH * (max - cur2 + 0.001)/max
						ctx.beginPath()
						ctx.arc(ORIGIN_X, ORIGIN_Y, WAVE_R + cur2/max * BG_IMAGE_X, 0, 2 * Math.PI)
						ctx.closePath()
						ctx.stroke()
						ctx.restore()
					}

					// 波纹3
					if (cur3 > 0 || cur >= max / 3 * 2) {
						if (cur3 >= max) cur3 = 0
						cur3 = this.data.didStopWaveAnimate ? cur3 : cur3 + 1
						ctx.save()
						ctx.lineWidth = WAVE_LINE_WIDTH * (max - cur3 + 0.001)/max
						ctx.beginPath()
						ctx.arc(ORIGIN_X, ORIGIN_Y, WAVE_R + cur3/max * BG_IMAGE_X, 0, 2 * Math.PI)
						ctx.closePath()
						ctx.stroke()
						ctx.restore()
					}

					canvas.requestAnimationFrame(waveFn)
				}
				let t = setTimeout(() => {
					canvas.requestAnimationFrame(waveFn)
					clearTimeout(t)
				}, 900)
			})
	},

	// 更新进度条
	updateProgress(angle) {
		let ctx = this.data.progressCTX

		// 进度条动画
		ctx.lineWidth = PG_LINE_WIDTH
		ctx.strokeStyle = this.data.progressLineColor
		ctx.lineCap = "round"
		ctx.save()
		ctx.beginPath()
		ctx.arc(ORIGIN_X, ORIGIN_Y, PG_R, -Math.PI / 2, angle * Math.PI - Math.PI / 2)
		ctx.stroke()
		ctx.restore()

		// 进度条圆点动画
		ctx.save()
		ctx.translate(ORIGIN_X, ORIGIN_Y)
		ctx.rotate(angle * Math.PI - Math.PI / 2)
		ctx.lineWidth = PG_DOT_LINE_WIDTH
		ctx.strokeStyle = this.data.progressLineColor
		ctx.beginPath()
		ctx.arc(PG_R, 0, PG_DOT_R, 0, 2 * Math.PI)
		ctx.fillStyle = "#4f4f4f"
		ctx.fill()
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	},

	// 运行进度条动画
	playProgressAnimate(seconds) {
		let canvas = this.data.progressCanvas
		let total = seconds * frequency

		let fn = () => {
			this.data.current = this.data.didStopProgressAnimate ? this.data.current : this.data.current + 1
			this.data.progressCTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
			this.updateProgress(this.data.current / total * 2)

			canvas.requestAnimationFrame(fn)
		}
		canvas.requestAnimationFrame(fn)
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
	},

	// 下载音频
	_downloadAudio(link) {
		return new Promise(resolve => {
			wx.downloadFile({
				url: link,
				success(res) {
					if (res.statusCode === 200) {
						resolve(res.tempFilePath)
					}
				}
			})
		})
	},

	// 播放音频
	_playAudio() {
		let audio = wx.getBackgroundAudioManager()
		audio.title = "花样正念"
		audio.src = this.data.audioLink

		// 监听音频加载成功可以播放
		audio.onCanplay(() => {
			console.log('bg audio resource ready')
		})

		// 监听音频开始播放
		audio.onPlay(() => {
			console.log('bg audio play')
			if (this.data.didAnimateInit) {
				this._switchAnimateState("start")
			} else {
				this.initCanvasAnimate()
				this.setData({didAnimateInit: true})
			}
		})

		// 监听音频暂停
		audio.onPause(() => {
			console.log('bg audio pause', this.data.bgAudio.currentTime)
			this._switchAnimateState("stop")
		})

		// 监听音频完成跳转事件
		audio.onSeeked(() => {
			console.log("bg audio seeked", this.data.bgAudio.currentTime)
		})

		audio.onEnded(() => {
			console.log('bg audio end')
			this._resetAudioSeek()
		})

		audio.onStop(() => {
			console.log('bg audio stop');
			this._resetAudioSeek()
		})

		// 兼容外置播放器解析音频报错问题
		audio.onError((err) => {
			console.error("bg audio error", err)
			this.setData({bgAudioPaused: true})
			this._switchAnimateState("stop")
		})

		this.setData({bgAudio: audio, needInitBgAudio: false})
	},

	// 暂停or继续播放
	_toggleAudio() {
		let audio = this.data.bgAudio

		// 初始化音频&开始播放
		if (this.data.needInitBgAudio) {
			return this._playAudio()
		}

		if (audio.paused) {
			audio.play()
		} else {
			audio.pause()
		}
	},

	// 操作进度
	_operateSeek(e) {
		if (this.data.operateLock) return false

		this.setData({operateLock: true})
		let lockTimer = setTimeout(() => {
			this.setData({operateLock: false})
			clearTimeout(lockTimer)
		}, 500)

		let type = e.currentTarget.dataset.type
		switch (type) {
			case "backward": {
				this._backward()
				break
			}
			case "speed": {
				this._speed()
				break
			}
		}
	},

	// 回退
	_backward() {
		let audio = this.data.bgAudio
		let curTime = audio.currentTime
		let nextTime = curTime - 15
		nextTime = nextTime > 0 ? nextTime : 0
		if (nextTime > 0) {
			this.setData({current: this.data.current - 15 * frequency})
		} else {
			this.setData({current: 0})
		}
		console.log('回退', curTime, nextTime)
		audio.seek(nextTime)
	},

	// 快进
	_speed() {
		let audio = this.data.bgAudio
		let curTime = audio.currentTime
		let duration = audio.duration
		let nextTime = curTime + 15
		if (nextTime >= duration) {
			audio.stop()
		} else {
			this.setData({current: this.data.current + 15 * frequency})
			audio.seek(nextTime)
		}
		console.log('快进', curTime, nextTime);
	},

	// 重置音频进度
	_resetAudioSeek() {
		this.setData({current: 0, needInitBgAudio: true})
		this._switchAnimateState("stop")
	},

	/**
	 * 切换动画状态
	 * @param state, stop:暂停, start:启动
	 * @private
	 */
	_switchAnimateState(state) {
		let bool = false
		switch (state) {
			case "stop": {
				bool = true
				break
			}
			case "start": {
				bool = false
				break
			}
		}
		this.setData({didStopWaveAnimate: bool, didStopProgressAnimate: bool, bgAudioPaused: bool})
	}
})
