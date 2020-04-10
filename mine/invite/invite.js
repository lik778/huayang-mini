// mine/invite/invite.js
import {
  createCanvas
} from "./canvas"
import {
  getInviteCode
} from "../../api/mine/index"
import {getLocalStorage } from "../../utils/util"
import {GLOBAL_KEY} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcCode: "",
    canvasUrl:""
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
    wx.downloadFile({
      url: this.data.canvasUrl,
      success(res) {
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
    this.inviteCode()
    createCanvas().then(res=>{
      this.setData({
        canvasUrl:res
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