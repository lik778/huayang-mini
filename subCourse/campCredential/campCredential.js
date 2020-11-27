// subCourse/campCredential/campCredential.js
import {
  getLocalStorage,
  isIphoneXRSMax
} from "../../utils/util"
import {
  drawFont,
  drawImage,
  drawImageAuto,
  drawRact,
  drawLine,
  measureTextWidth,
  drawBorderCircle
} from "../../utils/canvas"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemParams: '',
    statusBarHeight: 20,
    htmlBgHeight: "", //html模块动态高度
    isIphoneXRSMax: false, //是否是x以上系列手机
    canvasHeight: '', //canvas高度
    canvasWidth: "", //canvas宽度
    canvasSrc: '', //生成的canvas地址
    campData: "",
    userData: '',
    Nowdate: '',
    // LogoList: ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg'],
    hostBg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg",
    LogoList: []
  },

  // 返回
  back() {
    wx.redirectTo({
      url: `/subCourse/campDetail/campDetail?id=${this.data.campData.id}&share=true`,
    })
  },

  // 保存到相册
  saveToAlbum() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.canvasSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.canvasSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                  }
                }
              })
            }
          })
        }
      }
    })

  },

  // 绘制canvas
  drawCredential() {
    let ctx = wx.createCanvasContext('canvas')
    let userName = this.data.userData.real_name || this.data.userData.nick_name
    let campName = this.data.campData.name
    ctx.font = 'bold 22px SourceHanSerifCN-Bold, SourceHanSerifCN'
    let userNameX = (this.data.canvasWidth - measureTextWidth(ctx, userName)) / 2
    ctx.font = 'normal 12px PingFangSC-Regular, PingFang SC'
    let campNameX = (this.data.canvasWidth - measureTextWidth(ctx, `《${campName}》`)) / 2
    ctx.scale(3, 3)
    drawImage(ctx, this.data.hostBg, 0, 0, this.data.canvasWidth, this.data.canvasHeight).then(() => {
      drawImageAuto(ctx, this.data.LogoList[0], this.data.LogoList[1], this.data.canvasWidth).then(() => {
        drawFont(ctx, userName, '#0B0B0B', 'bold', 'SourceHanSerifCN-Bold, SourceHanSerifCN', 22, userNameX, 177)
        drawFont(ctx, `《${campName}》`, '#730807', 'normal', 'PingFangSC-Regular, PingFang SC', 12, campNameX, 237)
        drawFont(ctx, this.data.Nowdate, '#000000', 'normal', 'PingFangSC-Light, PingFang SC', 10, 117, 342)
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            success: (res) => {
              let tempFilePath = res.tempFilePath;
              wx.hideLoading()
              this.setData({
                canvasSrc: tempFilePath
              })
            },
            fail: function (res) {
              console.log(res);
            }
          }, this);
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let logoList = ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606479354jNvJpJ.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606479354jNvJpJ.jpg']
    let campData = JSON.parse(options.campData)
    let userData = JSON.parse(options.userData)
    let logoData = options.logo === '' ? logoList : options.logo.split(",")
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let Nowdate = year + "年" + month + "月"
    this.setData({
      campData,
      userData,
      Nowdate,
      LogoList: logoData
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
    let systemParams = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    this.setData({
      statusBarHeight: systemParams.statusBarHeight,
      systemParams: systemParams,
      htmlBgHeight: ((systemParams.screenWidth - 90) * 1.78).toFixed(2),
      isIphoneXRSMax: isIphoneXRSMax(),
      canvasWidth: systemParams.screenWidth - 90,
      canvasHeight: Number(((systemParams.screenWidth - 90) * 1.78).toFixed(2)),
      mainHeight: isIphoneXRSMax() ? systemParams.screenHeight - systemParams.statusBarHeight - 117 : systemParams.screenHeight - systemParams.statusBarHeight - 97,
      radio: ((systemParams.screenWidth - 90) / 286).toFixed(2)
    })
    this.drawCredential()
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