import { checkIsPrice, getLocalStorage, toast } from "../../utils/util"
import { getUserInfo, withDrawFun } from "../../api/mine/index"
import { GLOBAL_KEY } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cashNo: "", // 提现金额
		cashLock: true, // 现金锁
		userInfo: ""
	},

	// 实时更新输入框文字
	changeInputValue(e) {
		let text = e.detail.value
		this.setData({
			cashNo: text
		})
	},

	// 全部提现
	getAllCash() {
		if (parseFloat(this.data.userInfo.amount) > 0) {
			this.setData({cashNo: this.data.userInfo.amount})
		}
	},

	// 提交提现申请
	giveMeCash() {
		setTimeout(() => {
			if (this.data.cashNo === '') {
				wx.showModal({
					title: '提示',
					content: '提现金额不能为空',
					showCancel: false
				})
				return
			} else if (this.data.cashNo < 100) {
				wx.showModal({
					title: '提示',
					content: '提现金额不能低于100元',
					showCancel: false
				})
				return
			} else if (!checkIsPrice(this.data.cashNo)) {
				wx.showModal({
					title: '提示',
					content: '提现金额错误',
					showCancel: false
				})
				return
			} else if (parseFloat(this.data.cashNo) > parseFloat(this.data.userInfo.amount)) {
				wx.showModal({
					title: '提示',
					content: '提现金额不能超过全部余额',
					showCancel: false
				})
				return
			}
			if (this.data.cashLock) {
				this.setData({cashLock: false})
				withDrawFun({
					amount: this.data.cashNo * 100 | 0,
					open_id: getLocalStorage(GLOBAL_KEY.openId),
				}).then(() => {
					wx.redirectTo({
						url: "/mine/convertCash/convertCash", success() {
							toast("提现成功，我们会在1-3个工作日内完成审核", 3000)
						}
					})
				}).catch(() => {
					let t = setTimeout(() => {
						this.setData({cashLock: true})
						clearTimeout(t)
					}, 1000)
				})
			}
		}, 100)
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

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		getUserInfo('scene=zhide').then(res => {
			res.amount = Number((res.amount / 100).toFixed(2))
			this.setData({userInfo: res})
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

	}
})
