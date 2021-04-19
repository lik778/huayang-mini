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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
    bg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1618799340LotLdi.jpg",
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
      title: '课程全解锁，一卡学全年',
      path: `/mine/joinFluentLearn/joinFluentLearn?inviteId=${this.data.distributeId}`
    }
  },
  /**
   * 分享给好友
   */
  shareToFriend() {
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
    await drawImage(ctx, this.data.bg, 0, 0, 236, 512)
    // 用户信息
    await drawCircleHeadIcon(ctx, this.data.avatar,44, 83, 18)
    await drawFont(ctx, calcStringLen(this.data.nickname) > 16 ? `我是${splitTargetNoString(this.data.nickname, 16)}..` : `我是${this.data.nickname}`, '#ffffff', "400", "PingFangSC", 12, 74, 68)
    await drawFont(ctx, "和我一起加入花样大学吧!", '#ffffff', "400", "PingFangSC", 12, 74, 85)
    await drawFont(ctx, "“", '#C13525', "400", "PingFangSC", 40, 70, 50)
    await drawFont(ctx, "”", '#C13525', "400", "PingFangSC", 40, 187, 100)
    // 二维码
    await drawBorderCircle(ctx, this.data.qrcode, 23 + 30, 427 + 30, 30)

    ctx.draw(false, () => {
      wx.hideLoading()
      this._saveCanvasImageToLocal("oldInviteNew")
        .then(({tempFilePath, errMsg}) => {
          if (errMsg === "canvasToTempFilePath:ok") {
            queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum)
              .then(() => {
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
          }
        })
        .catch((err) => {
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
          width: 858,
          height: 1527,
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
