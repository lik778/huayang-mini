// subMall/detail/detail.js
import { getProductInfo, getYouZanAppId } from "../../api/mall/index"
import { checkAuth } from "../../utils/auth"

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		appId: '',
		prdId: 0,
		indicatorDots: true,
		vertical: false,
		autoplay: false,
		interval: 2000,
		duration: 500,
		bannerList: [],
		productInfo: {
			price: 0
		},
		detailContent: [],
		form: {
			first_category_id: 0,
			offset: 0,
			limit: 10
		}
	},
	navigateToMiniProgram() {
		wx.navigateToMiniProgram({
			appId: this.data.appId,
			path: this.data.productInfo.third_link,
			success() {
				console.log('success');
			},
			fail(e) {
				console.error(e);
			},
			complete() {
				console.log('complete');
			}
		})
	},
	getProductInfo(productId) {
		getProductInfo({product_id: productId}).then(({media_list, product}) => {
			this.setData({
				bannerList: [...media_list],
				productInfo: {...product},
				detailContent: product.detail_content.split(',')
			})
		})
	},
	getMiniProgramAppId() {
		getYouZanAppId().then(appId => {
			this.setData({appId})
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function ({prdId}) {
		if (prdId) {
			this.setData({
				prdId
			})
			this.getProductInfo(prdId)
		} else {
			wx.switchTab({
				url: '/pages/mall/mall'
			})
		}
		// 获取有赞商城小程序appId
		this.getMiniProgramAppId()
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: "花样值得买",
			path: '/subMall/detail/detail?prdId=' + this.data.prdId
		}
	}
})
