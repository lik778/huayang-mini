// subCourse/campCredential/campCredential.js
import {
  getLocalStorage,
  isIphoneXRSMax
} from "../../utils/util"
import {
  drawFont,
  drawImage,
  drawImageAuto,
  measureTextWidth,
} from "../../utils/canvas"
import {
  ErrorLevel,
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import {
  collectError
} from "../../api/auth/index"

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
    userName: '',
    Nowdate: '',
    hostBg: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg",
    LogoList: [],
    isRowStyle: false,
    sevenActivityCampId: 17, //2021-12-15 7天私域快闪群活动训练营ID
  },

  // 返回
  back() {
    wx.redirectTo({
      url: `/subCourse/campDetail/campDetail?id=${this.data.campData.id}&share=true`,
    })
  },

  // 分享朋友
  savePoint() {
    bxPoint("page_camp_credential_share", {
      traincamp_id: this.data.campData.id
    }, false)
  },

  // 保存到相册
  saveToAlbum() {
    bxPoint("page_camp_credential_save", {
      traincamp_id: this.data.campData.id
    }, false)
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
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "jj.campCredential.saveImageToPhotosAlbum",
                    error_code: 400,
                    error_message: err
                  })
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
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "jj.campCredential.saveImageToPhotosAlbum",
                    error_code: 400,
                    error_message: err
                  })
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
    wx.showLoading({
      title: '绘制中...',
    })
    let ctx = wx.createCanvasContext('canvas')
    let userName = this.data.userName
    let campName = this.data.campData.name
    ctx.font = 'bold 22px SourceHanSerifCN-Bold, SourceHanSerifCN'
    let userNameX = (286 - measureTextWidth(ctx, String(userName))) / 2
    ctx.font = 'normal 12px PingFangSC-Regular, PingFang SC'
    let campNameX = (286 - measureTextWidth(ctx, `《${campName}》`)) / 2
    ctx.scale(3, 3)
    drawImage(ctx, this.data.hostBg, 0, 0, 286, 510).then(async () => {
      if (this.data.campData.id !== this.data.sevenActivityCampId) {
        let res1 = await drawImageAuto(ctx, this.data.LogoList[0], this.data.LogoList[1])
        this.setData({
          isRowStyle: res1
        })
      }
      drawFont(ctx, String(userName), '#0B0B0B', 'bold', 'SourceHanSerifCN-Bold, SourceHanSerifCN', 22, userNameX, 177)
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let logoList = ['https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606721434GSUkFm.jpg', 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606721430eIijle.jpg']
    let campData = JSON.parse(options.campData)
    campData.name = campData.name.length > 12 ? campData.name.slice(0, 12) : campData.name
    let userName = options.userName.length > 6 ? options.userName.slice(0, 6) : options.userName
    let logoData = options.logo === '' ? logoList : options.logo.split(",")
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let Nowdate = year + "年" + month + "月"
    let systemParams = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    this.setData({
      statusBarHeight: systemParams.statusBarHeight,
      systemParams: systemParams,
      htmlBgHeight: ((systemParams.screenWidth - 90) * 1.78).toFixed(2),
      isIphoneXRSMax: isIphoneXRSMax(),
      canvasWidth: systemParams.screenWidth - 90,
      canvasHeight: Number(((systemParams.screenWidth - 90) * 1.78).toFixed(2)),
      mainHeight: isIphoneXRSMax() ? systemParams.screenHeight - systemParams.statusBarHeight - 117 : systemParams.screenHeight - systemParams.statusBarHeight - 97,
      radio: ((systemParams.screenWidth - 90) / 286).toFixed(2),
      campData,
      userName,
      Nowdate,
      LogoList: logoData,
      hostBg: campData.id === this.data.sevenActivityCampId ? 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1639551039psUfBH.jpg' : "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606447725FvEaJd.jpg"
    })

    this.drawCredential()
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
    return {
      title: `我正在参加${this.data.campData.name}，每天都有看的见的变化，快来试试`,
      path: `/subCourse/joinCamp/joinCamp?id=${this.data.campData.id}&share=true`
    }
  }
})