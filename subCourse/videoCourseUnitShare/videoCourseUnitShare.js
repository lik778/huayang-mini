import { batchDownloadFiles, calcStringLen, queryWxAuth, splitTargetNoString, toast } from "../../utils/util"
import { ErrorLevel, WX_AUTH_TYPE } from "../../lib/config"
import { collectError } from "../../api/auth/index"
import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coreData: null,
    _invokeSaveToLocalAction: false, // 用户是否已经点击保存图片到本地
    _didDrawCanvasDone: false, // 绘制canvas是否已经结束
    covers: ["https://huayang-img.oss-cn-shanghai.aliyuncs.com/1617860455BexQhv.jpg"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("transmitUnitShareData", function ({data}) {
      self.setData({coreData: {...data, cover: self.data.covers[0]}})
      bxPoint("series_learn_check_in_page", {
        series_id: data.id,
        lesson_num: data.lesson_num,
        lesson_name: data.lesson_name
      })
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "我在花样百姓，和我一起学习、游玩吧，开心每一天！",
      path: `/subCourse/videoCourse/videoCourse?videoId=${this.data.coreData.id}`
    }
  },
  // 启动器
  run() {
    this.drawCanvas()
  },
  // 准备绘制
  drawCanvas() {
    let {cover, avatar, qrCode} = this.data.coreData
    let assets = [cover, avatar, qrCode]

    batchDownloadFiles(assets).then(([coverImage, avatarImage, qrCodeImage]) => {
      this.drawHiddenCanvas(coverImage, avatarImage, qrCodeImage)
    })

  },
  // 正式绘制画布
  drawHiddenCanvas(coverImage, avatarImage, qrCodeImage) {
    const canvasWidth = 300
    const canvasHeight = 480
    let ctx = wx.createCanvasContext('unitShareCanvas', this)
    ctx.scale(3, 3)
    ctx.save()
    ctx.rect(0, 0, canvasWidth, canvasHeight)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.restore()
    // 背景
    ctx.drawImage(coverImage, 0, 0, canvasWidth, 347)
    // 日期
    ctx.save()
    ctx.font = `bold ${28}px PingFangSC`
    this.drawName(ctx, this.data.coreData.date, 28, 15, 25, 'white')
    ctx.restore()
    // 头像
    this.drawBorderCircle(ctx, avatarImage, 45, 347, 30)
    // 昵称
    ctx.save()
    let nickname = this.data.coreData.nickname
    nickname = calcStringLen(nickname) > 20 ? `${splitTargetNoString(nickname, 20)}..` : nickname
    ctx.font = `500 ${18}px PingFang SC`
    this.drawName(ctx, nickname, 18, 85, 317, "white")
    ctx.restore()
    // slogan
    ctx.save()
    ctx.font = `${13}px PingFangSC`
    this.drawName(ctx, "正在花样大学学习", 13, 85, 357, "black")
    ctx.restore()
    // 课程名称
    ctx.save()
    ctx.font = `bold ${18}px PingFangSC`
    let name = this.data.coreData.name
    name = calcStringLen(name) > 20 ? `${splitTargetNoString(name, 20)}..` : name
    this.drawName(ctx, name, 18, 15, 412, "black")
    ctx.restore()
    // 课程描述
    ctx.save()
    ctx.font = `${14}px PingFangSC`
    let desc = this.data.coreData.desc
    desc = calcStringLen(desc) > 26 ? `${splitTargetNoString(desc, 26)}..` : desc
    this.drawName(ctx, desc, 14, 15, 438, "black")
    ctx.restore()
    // 二维码
    ctx.drawImage(qrCodeImage, 216, 363, 68, 68)
    // 提示文案
    ctx.save()
    ctx.font = `${10}px PingFangSC`
    this.drawName(ctx, "长按识别二维码", 10, 216, 437, 'black')
    this.drawName(ctx, "一起练习", 10, 216, 451, 'black')
    ctx.restore()

    ctx.draw(true, () => {
      wx.hideLoading()
      this.setData({_didDrawCanvasDone: true}, () => {
        // 如果用户在绘制结束前已经点击"保存图片到本地"，则自动触发saveToLocal
        if (this.data._invokeSaveToLocalAction) {
          this.saveToLocal()
        }
      })
    })
  },
  // 绘制名字
  drawName(ctx, text, fontSize, x, y, color) {
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
    // ctx: 上下文;url: 图片地址;x: 圆中心x位置;y: 圆中心y位置;r: 圆半径
    // 保存上下文
    ctx.save()
    //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.beginPath()
    // 先画个大圆，为了能有圆环
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
    ctx.drawImage(url, x - r, y - r, r * 2, r * 2)
    // 恢复画布
    ctx.restore()
  },
  onContinueTap() {
    let self = this
    wx.navigateBack({
      complete() {
        bxPoint("series_learn_check_in_continue", {
          series_id: self.data.coreData.id,
          lesson_num: self.data.coreData.lesson_num,
          lesson_name: self.data.coreData.lesson_name
        }, false)
      }
    })
  },
  // 保存图片到相册
  saveToLocal() {
    let self = this
    if (!this.data._didDrawCanvasDone) {
      wx.showLoading({
        title: '海报生成中...',
        mask: true
      })
      this.setData({
        _invokeSaveToLocalAction: true
      })
      return
    }

    this._saveCanvasImageToLocal('unitShareCanvas').then(({tempFilePath}) => {
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
                page: "dd.videoCourseUnitShare.saveImageToPhotosAlbum",
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
    })

    bxPoint("series_learn_check_in_share", {
      series_id: self.data.coreData.id,
      lesson_num: self.data.coreData.lesson_num,
      lesson_name: self.data.coreData.lesson_name
    }, false)
  },
  // 保存canvas图片到本地
  _saveCanvasImageToLocal(canvasId, x = 0, y = 0, fileType = 'png') {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        x,
        y,
        width: 900,
        height: 1440,
        canvasId,
        fileType,
        success(result) {
          resolve(result)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
})
