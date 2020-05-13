// pages/mall/mall.js
import { getBannerList, getCategory, getProductList, getYouZanAppId } from "../../api/mall/index"
import { checkAuth } from "../../utils/auth"
import { $notNull, changeTwoDecimal_f, getLocalStorage, setLocalStorage } from "../../utils/util"
import { setPoint } from "../../api/live/index"
import { GLOBAL_KEY } from "../../lib/config"
import { bindWxPhoneNumber } from "../../api/auth/index"
import Dialog from "../../miniprogram_npm/@vant/weapp/dialog/dialog"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		swiperHeight: '',
		bannerList: [],
		categoryList: [],
		productList: [],
		current: 0,
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		interval: 3000,
		duration: 500,
		circular: true,
		offset: 0,
		limit: 10,
		didNoMore: false,
		show: false
	},
	jumpToLink(e) {
		let {link, id, vip_only, link_type} = e.currentTarget.dataset.item
		if (vip_only == 1) {
			let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
			if (!$notNull(accountInfo)) {
				// 手机号鉴权
				this.setData({show: true})
				return false
			}

			if (!accountInfo.is_zhide_vip) {
				Dialog.confirm({
					title: '提示',
					message: '立即加入“花样汇”享专属活动优惠'
				})
					.then(() => {
						wx.navigateTo({
							url: '/mine/joinVip/joinVip',
						})
					}).catch(() => {})
				return false
			}
		}
		setPoint({banner_id: id})
		if (link_type === 'youzan') {
			getYouZanAppId().then(appId => {
				wx.navigateToMiniProgram({
					appId,
					path: link,
				})
			})
		} else {
			wx.navigateTo({url: link})
		}
	},
	/**
	 * 一键获取微信手机号
	 * @param e
	 */
	async getPhoneNumber(e) {
		if (!e) return
		let {
			errMsg = '', encryptedData: encrypted_data = '', iv = ''
		} = e.detail
		if (errMsg.includes('ok')) {
			let open_id = getLocalStorage(GLOBAL_KEY.openId)
			if (encrypted_data && iv) {
				let originAccountInfo = await bindWxPhoneNumber({
					open_id,
					encrypted_data,
					iv
				})
				setLocalStorage(GLOBAL_KEY.accountInfo, originAccountInfo)
			}
		} else {
			console.error('用户拒绝手机号授权')
		}
	},
	currentHandle(e) {
		let {current} = e.detail
		this.setData({current})
	},
	queryProductList() {
		getProductList({
			limit: this.data.limit,
			offset: this.data.offset,
		}).then((list) => {
			list = list || []
			if (list.length < this.data.limit) {
				this.data.didNoMore = true
			}

			list.forEach(item => {
				item.product.discount_price = changeTwoDecimal_f(item.product.discount_price / 100)
			})

			let result = [...this.data.productList, ...list]
			this.setData({
				productList: result,
				offset: result.length
			})
		})
	},
	queryCategory() {
		getCategory({level: 1, category_type: 0}).then(list => {
			this.setData({
				categoryList: list.slice()
			})
		})
	},
	getBanner() {
		getBannerList({scene: 4}).then(list => {
			// 获取首张banner图片信息
			if (list.length > 0) {
				let {pic_width: width, pic_height: height} = list[0]
				this.setData({swiperHeight: (height * 688) / width + 'rpx'})
			}
			this.setData({
				bannerList: list.slice()
			})
		})
	},
	buy(e) {
		let target = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/detail/detail?prdId=' + target.product.id
		})
	},
	navigateToCategory(e) {
		let item = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/subMall/category/category?categoryId=' + item.id
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.queryCategory()
		this.queryProductList()
		this.getBanner()
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
		if (this.data.didNoMore) {
			return console.log('没有更多数据～')
		}
		this.queryProductList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '花样值得买',
			path: '/pages/mall/mall'
		}
	}
})
