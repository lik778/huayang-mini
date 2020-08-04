// components/navibar.js
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		title: {
			type: String
		},
		titleColor: {
			type: String,
			default: "black"
		},
		color: {
			type: String,
			default: ""
		},
		hideIcon: {
			type: Boolean,
			default: false
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusBarHeight: 0,
		didMute: false, // 是否静音
		bgmAudio: null
	},
	observers: {
		"hideIcon": function (newValue) {
			if (newValue && this.data.bgmAudio) {
				this.stopBGM()
			}
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		checkoutMute() {
			let currentState = this.data.didMute
			if (currentState) {
				this.playBGM()
			} else {
				this.pauseBGM()
			}
			this.setData({didMute: !currentState})
		},
		initBGM() {
			this.data.bgmAudio = wx.createInnerAudioContext()
			this.data.bgmAudio.loop = true
			this.data.bgmAudio.volume = 0.4
			this.data.bgmAudio.src = "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/236ad2e1-1739d996b39/236ad2e1-1739d996b39.mp3"
			this.data.bgmAudio.play()
		},
		pauseBGM() {
			this.data.bgmAudio.volume = 0
		},
		playBGM() {
			this.data.bgmAudio.volume = 0.5
		},
		stopBGM() {
			this.data.bgmAudio.stop()
			this.data.bgmAudio.destroy()
		}
	},
	attached() {
		this.setData({
			statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
		})
		// 开启bgm TODO
		// this.initBGM()
	},
	detached() {
		this.data.bgmAudio && this.data.bgmAudio.destroy()
	}
})
