// subLive/coueseList/coueseList.js
import {
	getCourseList,
	getCourseTypeList,
	getSubscriptionStatus,
	queryUserInfo,
	subscription,
	unSubscribe
} from "../../api/live/course"
import { bindWxPhoneNumber } from "../../api/auth/index"
import { GLOBAL_KEY, SubscribeKey, SubscriptType } from "../../lib/config"
import { checkIdentity, getLocalStorage, getSchedule, setLocalStorage } from "../../utils/util"
import { checkAuth } from "../../utils/auth"
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		didVisibleSubscribeBtn: true,
		courseId: 0,
		userInfo: {},
		customParams: {},
		activeTabIndex: 0,
		categoryId: 0,
		categoryList: [],
		courseList: [],
		limit: 10,
		offset: 0,
		didSubscript: false
	},
	/**
	 * 查询课程信息
	 * @param userId
	 */
	queryCourseInfo(userId) {
		queryUserInfo({user_id: userId}).then((info) => {
			let uInfo = {
				avatar: info.avatar_url,
				name: info.nick_name,
				desc: info.desc
			}
			this.setData({
				userInfo: uInfo
			})
		})
	},
	// 订阅||取消订阅课程
	subscript() {
		if (this.data.didSubscript) {
			unSubscribe({
				open_id: getLocalStorage(GLOBAL_KEY.openId),
				target_user_id: this.data.courseId,
				sub_key: SubscribeKey.zhibo
			}).then(() => {
				this.getStatus({callbackMessage: '取消订阅成功'})
			})
		} else {
			// 唤起微信小程序订阅
			let self = this
			wx.requestSubscribeMessage({
				tmplIds: [SubscriptType.subscriptMessage],
				success(res) {
					if (res[SubscriptType.subscriptMessage] === 'accept') {
						subscription({
							open_id: getLocalStorage(GLOBAL_KEY.openId),
							user_id: getLocalStorage(GLOBAL_KEY.userId),
							target_user_id: self.data.courseId,
							sub_key: SubscribeKey.zhibo
						}).then(() => {
							self.getStatus({callbackMessage: '订阅成功'})
						})
					}
					console.log(res, 'requestSubscribeMessage success callback')
				},
				fail(err) {
					console.log(err, 'requestSubscribeMessage error callback')
				}
			})
		}
	},
	// 获取订阅信息
	getStatus({callbackMessage} = {}) {
		let openId = getLocalStorage(GLOBAL_KEY.openId)
		getSubscriptionStatus({
			open_id: openId,
			target_user_id: this.data.courseId,
			sub_key: SubscribeKey.zhibo
		}).then(isSubscript => {
			this.setData({
				didSubscript: !!isSubscript,
				didVisibleSubscribeBtn: false
			})

			if (callbackMessage) {
				Toast({
					type: 'success',
					message: callbackMessage,
					duration: 2000
				})
			}
		}).catch(() => {
			this.setData({
				didVisibleSubscribeBtn: false
			})
		})
	},
	// 跳转去直播间
	jumpToLive(e) {
		let item = e.currentTarget.dataset.item // 直播间信息
		// 判断是否是会员/是否入学
		checkIdentity({roomId: item.num, link: item.link, zhiboRoomId: item.id})
			.then((callbackString) => {
				if (callbackString === 'updateWatchNo') {
					setTimeout(() => {
						// 更新直播间观看次数
						let list = [...this.data.categoryList]
						list.forEach(_ => {
							if (_.zhibo_room.id === item.id) {
								_.zhibo_room.visitCount += 1
							}
						})
						this.setData({
							categoryList: [ ...list ]
						})
					}, 1000)
				} else if (callbackString === 'no-phone-auth') {
					this.setData({
						show: true
					})
				} else if (callbackString === 'no-auth-daxue') {
					Dialog.confirm({
						title: '申请入学立即观看',
						message: '完成入学信息登记，观看课程'
					}).then(() => {
						wx.navigateTo({
							url: '/mine/joinSchool/joinSchool',
						})
					}).catch(() => {
					})
				}
			})
	},
	/**
	 * 一键获取微信手机号
	 * @param e
	 */
	async getPhoneNumber(e) {
		if (!e) return
		let {errMsg = '', encryptedData: encrypted_data = '', iv = ''} = e.detail
		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({open_id, encrypted_data, iv})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			}
		} else {
			console.error('用户拒绝手机号授权')
		}
	},
	// 切换分类
	onChange(e) {
		// 清除缓存数据
		this.setData({
			courseList: [],
			limit: 10,
			offset: 0
		})
		this.data.categoryList.forEach(_ => {
			if (_.name === e.detail.title) {
				this.getList(_.id)
			}
		})
	},
	// 获取课程列表
	getList(categoryId) {
		if (categoryId) {
			this.setData({categoryId})
		} else {
			categoryId = this.data.categoryId
		}
		getCourseList(`?limit=${this.data.limit}&offset=${this.data.offset}&category_id=${categoryId}`)
			.then(({list, count}) => {
				list = list || []
				// 筛选出直播间状态不是"回看"的房间号
				let liveRoomIds = list.filter(_ => _.zhibo_room.num && _.kecheng.kecheng_type === 0).map(t => t.zhibo_room.num)
				let result = [...this.data.courseList, ...list] || []
				this.setData({
					courseList: result,
					offset: result.length
				})
				this.getStatusData(liveRoomIds)
				this.data.timer = setTimeout(() => {
					this.getStatusData(liveRoomIds)
				}, 60 * 1000)
			})
	},
	// 获取直播状态
	getStatusData(roomIds) {
		let courseList = [...this.data.courseList]
		getSchedule(roomIds).then(callbackCourseList => {
			if (callbackCourseList.length > 0) {
				courseList.forEach(_ => {
					let tar = callbackCourseList.find(o => o.roomId === _.zhibo_room.num)
					if (tar) {
						_.zhibo_room.liveStatus = tar.liveStatus
					}
				})
				this.setData({
					courseList
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function ({id: courseId}) {
		this.queryCourseInfo(courseId)
		this.setData({
			courseId
		})
		// 获取分类列表
		getCourseTypeList().then(categoryList => {
			if (categoryList.length > 0) {
				this.setData({
					categoryList: categoryList
				})
				this.getList(categoryList[0].id)
			}
		})
		// 获取订阅状态
		this.getStatus()
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
		checkAuth()
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
		this.getList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "花样大学",
			desc: "学习分享健康自信快乐的美",
			path: '/pages/courseList/courseList',
			imgUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586870905SEwHoX.jpg"
		}
	}
})
