import { getPeronAlbumInActivity, getPersonAlbumDetail } from "../../api/albums/index"
import request from "../../lib/request"
import { ROOT_URL } from "../../lib/config"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		albumCollectionId: 0,
		offset: 0,
		limit: 20,
		hasMore: true,
		pictures: [],
		info: null,
		photoNum: 0,
		visitNum: 0,
		isFromH5: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {id, from} = options

		if (id) {
			this.data.albumCollectionId = id
		}
		this.setData({isFromH5: from === "h5"})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.run()
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
		this.getList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			imageUrl: this.data.info.album.detail_header_pic,
			title: "个人精彩相册，看看美美照片",
			path: "/pages/personAlbum/personAlbum?id=" + this.data.albumCollectionId
		}
	},
	onPictureTap(e) {
		wx.previewImage({urls: this.data.pictures.map(n => n.media_url), current: e.currentTarget.dataset.url})
	},
	more() {
		if (this.data.isFromH5) {
			return wx.navigateBack()
		}
		let link = ""
		switch (request.baseUrl) {
			case ROOT_URL.dev: {
				link = "https://dev.huayangbaixing.com/#/home/albums/"
				break
			}
			case ROOT_URL.prd: {
				link = "https://huayang.baixing.com/#/home/albums/"
				break
			}
		}
		link = encodeURIComponent(link + this.data.info.album_id)
		wx.redirectTo({url: `/pages/activityAlbum/activityAlbum?link=${link}`})
	},
	refresh() {
		this.setData({
			hasMore: true,
			offset: 0,
			pictures: []
		})
		this.getList()
	},
	getInfo() {
		getPeronAlbumInActivity({album_collection_id: this.data.albumCollectionId})
			.then((data) => {
				this.setData({
					info: data,
					photoNum: data.pic_count >= 10000 ? (data.pic_count / 10000).toFixed(1) + "w" : data.pic_count,
					visitNum: data.view_count >= 10000 ? (data.view_count / 10000).toFixed(1) + "w" : data.view_count
				})
			})
	},
	getList() {
		if (!this.data.hasMore) return false
		getPersonAlbumDetail({
			album_collection_id: this.data.albumCollectionId,
			offset: this.data.offset,
			limit: this.data.limit
		}).then(({count, list}) => {
			list = list || []
			this.setData({
				hasMore: !(list.length < this.data.limit),
				pictures: [...this.data.pictures, ...list],
				offset: this.data.offset + list.length
			})
		})
	},
	run() {
		this.getInfo()
		this.getList()
	}
})
