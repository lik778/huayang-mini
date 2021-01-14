// subCourse/campSharePoster/campSharePoster.js
import { getLocalStorage, getNowDateAll, isIphoneXRSMax } from "../../utils/util"
import { ErrorLevel, GLOBAL_KEY } from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
import { collectError } from "../../api/auth/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: '',
    canvasWidth: '',
    canvasHeight: '',
    height: '',
    canvasRadio: "",
    backSrc: "",
    bgSrc: "",
    showDate: "",
    userInfo: '',
    isIphoneXRSMax: false,
    mainBgImage: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1606371212ZLgxIW.jpg",
    campAllData: ''
  },

  // 分享给好友
  shareTofriend() {
    bxPoint("page_traincamp_poster_save_button", {
      traincamp_id: this.data.campAllData.id,
      clock_time: getNowDateAll('-'),
      day_num: this.data.campAllData.day_num
    }, false)
  },

  // 保存海报
  downloadPoster() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              wx.saveImageToPhotosAlbum({
                filePath: this.data.backSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                    bxPoint("page_traincamp_poster_share_button", {
                      traincamp_id: this.data.campAllData.id,
                      clock_time: getNowDateAll('-'),
                      day_num: this.data.campAllData.day_num
                    }, false)
                  }
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "campSharePoster.saveImageToPhotosAlbum",
                    error_code: 401,
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
                filePath: this.data.backSrc,
                success: (res) => {
                  if (res.errMsg === "saveImageToPhotosAlbum:ok") {
                    wx.showToast({
                      title: '保存成功',
                      duration: 2000
                    })
                    bxPoint("page_traincamp_poster_share_button", {
                      traincamp_id: this.data.campAllData.id,
                      clock_time: getNowDateAll('-'),
                      day_num: this.data.campAllData.day_num
                    }, false)
                  }
                },
                fail(err) {
                  collectError({
                    level: ErrorLevel.p1,
                    page: "campSharePoster.saveImageToPhotosAlbum",
                    error_code: 401,
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

  // 开始绘制海报
  createPoster() {
    wx.showLoading({
      title: '绘制中...',
      mask: true,
    })
    let ctx = wx.createCanvasContext('canvas')
    let fontNomal = 'PingFangSC-Semibold, PingFang SC'
    let headIcon = this.data.userInfo.avatar_url
    ctx.scale(3, 3)
    this.drawRact(ctx, 0, 0, 300, 480, '#fff').then(() => {
      // 绘制主视觉
      this.drawImage(ctx, this.data.bgSrc, 0, 0, 300, 347).then(() => {
        // 绘制日期
        this.drawFont(ctx, String(this.data.showDate), "#fff", 'bold', fontNomal, 32, 15, 20).then(() => {
          // 绘制头像
          this.drawBorderCircle(ctx, headIcon, 51, 347, 34).then(() => {
            let elem = Math.ceil(ctx.measureText(String(this.data.campAllData.day_num)).width)
            // 绘制昵称
            this.drawFont(ctx, this.data.userInfo.nick_name, "#fff", 'bold', fontNomal, 18, 92, 320)
            this.drawFont(ctx, '正在花样百姓学习', "#000", 400, fontNomal, 14, 92, 357)
            this.drawFont(ctx, this.data.campAllData.name, "#000", 'normal', fontNomal, 15, 15, 402)
            this.drawFont(ctx, '第', "#000", 'normal', fontNomal, 14, 15, 438)
            this.drawFont(ctx, String(this.data.campAllData.day_num), "#000", 'bold', fontNomal, 30, 34, 425)
            this.drawFont(ctx, '天课程', "#000", 'normal', fontNomal, 14, elem + 39, 438)
            this.drawFont(ctx, '长按识别二维码', "#000", 'normal', fontNomal, 10, 220, 442)
            this.drawFont(ctx, '一起练习', "#000", 'normal', fontNomal, 10, 235, 456)
            this.drawImage(ctx, this.data.campAllData.qrcode, 221, 374, 68, 68).then(() => {
              ctx.draw(false, () => {
                wx.canvasToTempFilePath({
                  canvasId: 'canvas',
                  success: (res) => {
                    let tempFilePath = res.tempFilePath;
                    wx.hideLoading()
                    this.setData({
                      backSrc: tempFilePath
                    })
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                }, this);
              })
            })
          })
        })
      })
    })
  },

  // 绘制文字
  drawFont(ctx, text, fontColor, fontWeight = 'normal', fontFamily, fontSize, x, y) {
    return new Promise(resolve => {
      ctx.save()
      ctx.setTextBaseline('top')
      ctx.font = `normal ${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.setFillStyle(fontColor)
      ctx.fillText(text, x, y)
      ctx.restore()
      resolve()

    })
  },

  // 绘制图片
  drawImage(ctx, imageSrc, x, y, width, height) {
    return new Promise(resolve => {
      wx.downloadFile({
        url: imageSrc,
        success: (res) => {
          if (res.statusCode === 200) {
            ctx.save()
            ctx.drawImage(res.tempFilePath, x, y, width, height)
            ctx.restore()
            resolve()
          }
        }
      })
    })
  },

  // 绘制矩形
  drawRact(ctx, x, y, width, height, bg) {
    return new Promise(resolve => {
      ctx.save()
      ctx.rect(x, y, width, height)
      ctx.setFillStyle(bg)
      ctx.fill()
      ctx.restore()
      resolve()
    })

  },

  // 绘制直线
  drawLine(context, color, height, beginX, beginY, endX, endY) {
    // 设置线条的颜色
    context.strokeStyle = color;
    // 设置线条的宽度
    context.lineWidth = height;
    // 绘制直线
    context.beginPath();
    // 起点
    context.moveTo(beginX, beginY);
    // 终点
    context.lineTo(endX, endY);
    context.closePath();
    context.stroke();
  },

  // 绘制名字
  dramName(ctx, text, fontSize, x, y, color) {
    ctx.setTextBaseline('top')
    ctx.setFillStyle(color)
    ctx.setFontSize(fontSize)
    ctx.fillText(text, x, y)
  },

  // 计算字体宽度
  measureTextWidth(text, ctx) {
    return ctx.measureText(text).width
  },

  // 绘制边框圆形头像
  drawBorderCircle(ctx, url, x, y, r) {
    return new Promise(resolve => {
      // ctx: 上下文;url: 图片地址;x: 圆中心x位置;y: 圆中心y位置;r: 圆半径
      // 保存上下文
      ctx.save()
      //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.beginPath()
      ctx.arc(x, y, r + 2, 0, Math.PI * 2, false)
      ctx.setFillStyle('#fff')
      ctx.fill()
      ctx.save()
      // 画小圆
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2, false)
      ctx.setFillStyle('#fff')
      ctx.fill()
      ctx.clip()
      wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            ctx.drawImage(res.tempFilePath, x - r, y - r, r * 2, r * 2)
            // 恢复画布
            ctx.restore()
            resolve()
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let campAllData = options.data ? JSON.parse(options.data) : ''
    let systemParams = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    let width = systemParams.screenWidth - 76
    let height = Math.round((systemParams.screenWidth - 76) / 5 * 8)
    let todayDate = getNowDateAll('-').split(" ")[0]
    let year = todayDate.split('-')[0]
    let month = todayDate.split("-")[1] + "/" + todayDate.split("-")[2]
    let date = year + " " + month
    let bgSrc = ''
    let userInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    if (campAllData.poster_pics === '') {
      bgSrc = this.data.mainBgImage
    } else {
      let arr = campAllData.poster_pics.split(',')
      bgSrc = arr[Math.floor(Math.random() * arr.length)];
    }
    this.setData({
      canvasWidth: width,
      canvasHeight: height,
      showDate: date,
      campAllData: campAllData,
      bgSrc,
      userInfo
    })
    this.createPoster()
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
    let params = JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams))
    let data = isIphoneXRSMax()
    console.log(this.data.campAllData)
    this.setData({
      statusHeight: params.statusBarHeight,
      height: ((params.screenWidth - 76) * 1.6).toFixed(2),
      isIphoneXRSMax: data,
      boxHeight: data ? params.screenHeight - params.statusBarHeight - 111 : params.screenHeight - params.statusBarHeight - 91
    })
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
      title: `我正在参加${this.data.campAllData.name}，每天都有看的见的变化，快来试试`,
      path: `/subCourse/joinCamp/joinCamp?id=${this.data.campAllData.id}&share=true`
    }
  }
})
