// huayangLife/lifeDetail/lifeDetail.js
import {
  queryWaterfallDetailInfo
} from "../../api/huayangLife/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import {
  getLocalStorage,
  preloadNetworkImg
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitIcon: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1638840893RreULx.jpg",
    lifeId: "",
    active: 0,
    list: null,
    detailInfo: null,
    playing: false
  },

  /* 查看大图 */
  amplification(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.list // 需要预览的图片http链接列表
    })
  },

  /* 轮播切换 */
  changeIndicator(e) {
    let index = e.detail.current
    this.setData({
      active: index
    })
  },

  /* 播放暂停 */
  playEnd() {
    this.setData({
      playing: false
    })
  },

  /* 播放视频 */
  playVideo() {
    this.videoContext = wx.createVideoContext(`video`, this)
    this.setData({
      playing: true
    }, () => {
      setTimeout(() => {
        this.videoContext.play()
      }, 200)
    })
  },

  /* 获取详情信息 */
  getDetailInfo() {
    queryWaterfallDetailInfo({
      life_id: this.data.lifeId
    }).then(({
      data
    }) => {
      let list = data.material_url.split(',')
      preloadNetworkImg([{
        id: this.data.lifeId,
        url: data.type === 2 ? data.cover_url : list[0],
      }]).then(res => {
        let info = res[0]
        let sysWidth = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth
        let radio = (sysWidth / info.width).toFixed(2)
        let height = parseInt(radio * (info.height))
        let maxHeight = parseInt(sysWidth * 1.33)
        data.width = sysWidth
        data.height = height
        data.maxHeight = height > maxHeight ? maxHeight : height

        this.setData({
          list,
          detailInfo: data
        }, () => {
          bxPoint('life_style_detail_pageview', {
            tag_id: Number(this.data.detailInfo.class) + 1,
            life_id: this.data.detailInfo.id,
            life_title: this.data.detailInfo.title
          })
        })
      })
      // console.log(list)

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      id = ''
    } = options
    if (id) {
      this.setData({
        lifeId: id
      }, () => {
        this.getDetailInfo()
      })
    } else {
      wx.redirectTo({
        url: '/pages/discovery/discovery',
      })
    }
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
    bxPoint("life_style_detail_button", {
      tag_id: Number(this.data.detailInfo.class) + 1,
      life_id: this.data.detailInfo.id,
      life_title: this.data.detailInfo.title
    }, false)
    return {
      title: "花样好生活，领略不同人生",
      path: `/huayangLife/lifeDetail/lifeDetail?id=${this.data.lifeId}`
    }
  }
})