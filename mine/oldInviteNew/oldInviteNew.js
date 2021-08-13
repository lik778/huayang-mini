import { drawBorderCircle, drawCircleHeadIcon, drawFont, drawImage } from "../../utils/canvas"
import {
  calcStringLen,
  getLocalStorage,
  isIphoneXRSMax,
  queryWxAuth,
  splitTargetNoString,
  toast
} from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY, WX_AUTH_TYPE } from "../../lib/config"
import { collectError } from "../../api/auth/index"
import { getFluentQrCode } from "../../api/mine/index"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    postWidth: 0,
    postHeight: 0,
    contentWidthRatio: 1,
    bg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1619680656RHJkPN.jpg",
    avatar: "",
    nickname: "",
    qrcode: "",
    bottomNo: 0,
    distributeId: 0,
    saveLock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {inviteId} = options
    this.setData({distributeId: inviteId})
    this.run()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let isIphoneX = isIphoneXRSMax()
    if (isIphoneX) {
      this.setData({bottomNo: 60})
    }

    let {statusBarHeight, screenHeight, screenWidth} = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    let postHeight = screenHeight * (511/667)
    let postWidth = postHeight * (236/511)
    this.setData({
      statusHeight: statusBarHeight,
      postHeight,
      postWidth,
      postLeft: (screenWidth - postWidth) / 2,
      contentWidth: screenWidth*(156/375),
      yRatio: postHeight/511,
      xRatio: postWidth/236,
    })
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
    return {
      title: '一起加入花样老年大学，让退休生活更精彩！',
      path: `/mine/joinFluentLearn/joinFluentLearn?inviteId=${this.data.distributeId}`
    }
  },
  /**
   * 分享给好友
   */
  shareToFriend() {
    bxPoint("changxue_post_share", {}, false)
  },
  run() {
    let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.userInfo))
    this.setData({nickname: userInfo.nickname, avatar: userInfo.avatar_url})
    this.getCodeImage()
  },
  /**
   * 获取小程序码
   */
  getCodeImage() {
    getFluentQrCode({user_snow_id: this.data.distributeId}).then(({data}) => {
      this.setData({qrcode: data})
    })
  },
  /**
   * 保存到相册
   */
  saveToLocalAlbum() {
    wx.showLoading({title: '海报生成中...', mask: true})

    if (this.data.saveLock) return
    this.setData({saveLock: true})
    let t = setTimeout(() => {
      this.setData({saveLock: false})
      clearTimeout(t)
    }, 500)

    this.generateCanvas().then()
  },
  /**
   * 生成Canvas
   */
  async generateCanvas() {
    let ctx = wx.createCanvasContext('oldInviteNew')
    ctx.scale(3, 3)
    // bg
    await drawImage(ctx, this.data.bg, 0, 0, 236, 511)
    // 用户信息
    await drawCircleHeadIcon(ctx, this.data.avatar,44, 85, 20 )
    await drawFont(ctx, calcStringLen(this.data.nickname) > 16 ? `我是${splitTargetNoString(this.data.nickname, 16)}..` : `我是${this.data.nickname}`, '#ffffff', "400", "PingFangSC", 12, 70, 69)
    await drawFont(ctx, "和我一起加入花样老年大学吧!", '#ffffff', "400", "PingFangSC", 12, 70, 86)
    // 二维码
    await drawBorderCircle(ctx, this.data.qrcode, 23 + 30, 428 + 30, 30)

    ctx.draw(false, () => {
      this._saveCanvasImageToLocal("oldInviteNew")
        .then(({tempFilePath, errMsg}) => {
          if (errMsg === "canvasToTempFilePath:ok") {
            queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum)
              .then(() => {
                wx.hideLoading()
                wx.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success(res) {
                    toast('图片保存成功', 3000, 'success')
                  },
                  fail(err) {
                    collectError({
                      level: ErrorLevel.p1,
                      page: "dd.oldInviteNew.saveImageToPhotosAlbum",
                      error_code: 400,
                      error_message: err
                    })
                    toast('图片保存失败')
                  }
                })
              })
              .catch(() => {
                wx.hideLoading()
                wx.showModal({
                  title: '相册授权',
                  content: '保存失败，未获得您的授权，请前往设置授权',
                  confirmText: '去设置',
                  confirmColor: '#33c71b',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              })
          } else {
            wx.hideLoading()
          }
        })
        .catch((err) => {
          wx.hideLoading()
          console.error(err)
        })
    })
    return true
  },
  // 保存canvas图片到本地
  _saveCanvasImageToLocal(canvasId, x = 0, y = 0, fileType = 'png') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x,
          y,
          width: 708,
          height: 1533,
          canvasId,
          fileType,
          success(result) {
            resolve(result)
          },
          fail(err) {
            reject(err)
          }
        })
      }, 100)
    })
  },
})
