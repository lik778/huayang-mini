// mine/invite/invite.js
import {
  createCanvas
} from "./canvas"
import {
  getInviteCode
} from "../../api/mine/index"
import {
  getLocalStorage
} from "../../utils/util"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcCode: "",
    canvasUrl: "",
    posturl:""
  },
  // getImgUrl
  getImgUrl() {
    let  arr= ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586746698uNTYez.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586746556RRsZWh.jpg",
      "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586747541IzaDvb.jpg", "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1586747562GBKDfI.jpg"
    ];
    let index=Math.floor((Math.random() * arr.length))
    this.setData({
      posturl:arr[index]
    })
  },
  // 获取小程序邀请码
  inviteCode() {
    getInviteCode(`user_id=${getLocalStorage(GLOBAL_KEY.userId)}`).then(res => {
      this.setData({
        qcCode: res
      })
    })
  },
  // 保存到相册
  saveAlbum() {
    console.log( this.data.canvasUrl)
    wx.downloadFile({
      url: this.data.canvasUrl,
      success(res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
              wx.showToast({
                title: '保存成功',
                icon: "success",
                duration: 3000
              })
            } else {
              wx.showToast({
                title: '保存失败',
                icon: "none",
                duration: 3000
              })
            }
          },

        })

      },
      fail(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getImgUrl()
    this.inviteCode()
    createCanvas(this.data.posturl).then(res => {
      this.setData({
        canvasUrl: res
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

  }
})