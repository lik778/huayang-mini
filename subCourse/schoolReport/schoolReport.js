import { getLocalStorage, toast } from "../../utils/util"
import { getUserInfo } from "../../api/mine/index"
import { classCheckin, getCampDetail, getCampStageMessgae } from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"
import { GLOBAL_KEY } from "../../lib/config"
import { areaList } from '@vant/area-data'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		info: "",
		isAnniversary: false, // 是否是21年Q2周年庆
		didShowArea: false, // 展示地区选择器
		didShowAreaAnime: false,
		lock: true,
		form: {
			has_user_info: 1,
			name: "",
			mobile: "",
			province: "",
			city: "",
			area: "",
			address: ""
		},
		areaString: "",
		currentAreaCode: "310101",
		areaList
	},

	onMobileBlur(e) {
		this.setData({form: {...this.data.form, mobile: e.detail.value}})
	},
	onNameBlur(e) {
		this.setData({form: {...this.data.form, name: e.detail.value}})
	},
	onAddressBlur(e) {
		this.setData({form: {...this.data.form, address: e.detail.value}})
	},

	onCatchtouchmove() {
		return false
	},

	onAreaConfirm(e) {
		let arr = e.detail.values
		this.setData({
			form: {
				...this.data.form,
				province: arr[0].name,
				city: arr[1].name,
				area: arr[2].name
			},
			areaString: arr.map(n => n.name).join("-"),
			currentAreaCode: arr[2].code
		})
		this.onAreaClose()
	},

	onAreaTap() {
		this.setData({didShowArea: true})
		wx.nextTick(() => {
			this.setData({didShowAreaAnime: true})
		})
	},

	onAreaClose() {
		this.setData({didShowAreaAnime: false})
		let t = setTimeout(() => {
			this.setData({didShowArea: false})
			clearTimeout(t)
		}, 400)
	},

	// 返回
	back() {
		wx.switchTab({
			url: '/pages/practice/practice',
		})
	},

	// 报到
	toResult() {
		if (this.data.lock) {
			let params = {
				user_id: this.data.info.userId,
				traincamp_stage_id: this.data.info.stageId,
				class_num: this.data.info.class_num,
			}

			// 21年Q2周年庆训练营需要填写表单
			if (this.data.isAnniversary) {
				const reg = /^1[3456789][0-9]{9}$/
				const _phone = this.data.form.mobile.toString().trim()
				if (!_phone) {
					return toast("联系手机号不能为空")
				} else if (!reg.test(_phone)) {
					return toast("联系手机号格式错误")
				} else if (!this.data.form.name) {
					return toast("联系姓名不能为空")
				} else if (this.data.form.name.length >= 30) {
					return toast("联系姓名不能超过30个字符")
				} else if (!this.data.areaString) {
					return toast("请选择所在地区")
				} else if (!this.data.form.address) {
					return toast("详细地址不能为空")
				}

				params = {...params, ...this.data.form}
			}

			this.setData({lock: false})

			classCheckin(params).then(res => {
				if (res.code === 0) {
					wx.navigateTo({
						url: `/subCourse/schoolReportResult/schoolReportResult?data=${JSON.stringify(this.data.info)}`,
						complete() {
							bxPoint("daxue_enter")
						}
					})
				} else {
					wx.showToast({
						title: res.message,
						duration: 2000,
						icon: "none"
					})
					this.setData({lock: true})
				}
			}).catch((err) => {
				console.error(err)
				wx.showToast({
					title: '加入失败',
					duration: 2000,
					icon: "none"
				})
				this.setData({lock: true})
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {
			scene,
		} = options
		let sceneAry = ''
		let stage_id = ''
		let class_num = ''
		if (scene) {
			sceneAry = decodeURIComponent(scene).split('/');
			[stage_id = '', class_num = ''] = sceneAry
		} else {
			if (options.stage_id && options.class_num) {
				// 授完权返回
				stage_id = options.stage_id
				class_num = options.class_num
				this.setData({form: {...this.data.form, traincamp_stage_id: options.stage_id, class_num: options.class_num}})
			} else {
				// 没有参数
				wx.navigateTo({
					url: '/pages/discovery/discovery',
				})
				return
			}
		}
		getUserInfo("scene=zhide").then(res => {
			let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
			if (userInfo) {
				getCampStageMessgae({
					traincamp_stage_id: stage_id
				}).then(res1 => {
					getCampDetail({
						traincamp_id: res1.data.stage.kecheng_traincamp_id
					}).then(res => {
						this.setData({
							info: {
								name: res.name,
								date: res1.data.stage.date,
								class_num: class_num,
								stageId: stage_id,
								campId: res1.data.stage.kecheng_traincamp_id,
								userId: getLocalStorage(GLOBAL_KEY.userId),
							},
							isAnniversary: +res.in_activity === 1
						})
					})
				})
			} else {
				let redirectPath = `/subCourse/schoolReport/schoolReport?stage_id=${stage_id}&class_num=${class_num}`
				redirectPath = encodeURIComponent(redirectPath)
				wx.navigateTo({
					url: `/pages/auth/auth?redirectPath=${redirectPath}&needDecode=true`,
				})
			}
		}).catch((err) => {
			let redirectPath = `/subCourse/schoolReport/schoolReport?stage_id=${stage_id}&class_num=${class_num}`
			redirectPath = encodeURIComponent(redirectPath)
			wx.navigateTo({
				url: `/pages/auth/auth?redirectPath=${redirectPath}&needDecode=true`,
			})
		})
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

		this.setData({
			statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
		})
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

})
