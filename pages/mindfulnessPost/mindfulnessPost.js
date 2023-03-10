import {
  batchDownloadFiles,
  calcStringLen,
  getLocalStorage,
  queryWxAuth,
  splitTargetNoString,
  toast
} from "../../utils/util"
import {
  ErrorLevel,
  GLOBAL_KEY,
  WX_AUTH_TYPE
} from "../../lib/config"
import {
  queryPunchCardBg,
  queryPunchCardQrCode,
  queryUserHaveClassesInfo
} from "../../api/course/index"
import {
  collectError
} from "../../api/auth/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backPath: "",
    statusHeight: 0,
    postData: null,
    _invokeSaveToLocalAction: false, // 用户是否已经点击保存图片到本地
    _didDrawCanvasDone: false, // 绘制canvas是否已经结束

    didPunchedCard: false, // 当前页面生命周期内是否打过卡
    endTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })

    this.cookData(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  async cookData({actionName, duration, continuesDay, qrcode, image}) {
    let now = new Date()
    let accountInfo = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
    let cover = await queryPunchCardBg()
    let data = {
      date: `${now.getFullYear()} ${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`,
      recordNo: continuesDay,
      actionName,
      avatar: accountInfo.avatar_url,
      nickname: accountInfo.nick_name,
      duration,
      qrcode,
      cover: cover,
    }

    this.setData({
      postData: data,
      backPath: `/pages/mindfulnessList/mindfulnessList`
    })
    let timer = setTimeout(() => {
      this.initial()
      clearTimeout(timer)
    }, 20)
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //   }
  // },
  // 打卡
  punchCard() {
    if (this.data.didPunchedCard) return
    this.setData({
      didPunchedCard: true
    })
  },
  // 绘制直线
  drawLine(context, color, height, beginX, beginY, endX, endY) {
    // 设置线条的颜色
    context.strokeStyle = color
    // 设置线条的宽度
    context.setLineWidth(height)
    // 绘制直线
    context.beginPath()
    // 起点
    context.moveTo(beginX, beginY)
    // 终点
    context.lineTo(endX, endY)
    context.closePath()
    context.stroke()
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
  /**
   * 绘制隐藏的canvas
   * @param coverImage
   * @param avatarImage
   * @param qrCodeImage
   * @param recordNo
   */
  drawHiddenCanvas(coverImage, avatarImage, qrCodeImage, recordNo) {
    const canvasWidth = 300
    const canvasHeight = 366
    let ctx = wx.createCanvasContext('mindfulnessOrder', this)
    ctx.save()
    ctx.rect(0, 0, 300, 480)
    ctx.setFillStyle('#fff')
    ctx.fill()
    ctx.restore()
    // 背景
    ctx.drawImage(coverImage, 0, 0, canvasWidth, canvasHeight)
    // 日期
    ctx.save()
    ctx.font = `bold ${32}px Condensed`
    this.drawName(ctx, this.data.postData.date, 32, 15, 20, 'white')
    ctx.restore()
    // 打卡次数
    ctx.font = `bold ${15}px PingFang SC`
    this.drawName(ctx, "第", 18, 15, 69, 'white')
    ctx.save()
    ctx.font = `bold ${27}px Condensed`
    let recordNoWidth = this.measureTextWidth(String(recordNo), ctx)
    this.drawName(ctx, String(recordNo), 27, 36, 62, 'white')
    ctx.restore()
    this.drawName(ctx, "天打卡", 18, 37 + recordNoWidth, 69, 'white')
    // 训练名称
    let actionName = this.data.postData.actionName.length > 10 ? `${this.data.postData.actionName.slice(0, 10)}..` : this.data.postData.actionName
    this.drawName(ctx, actionName, 18, 94, 338, 'white')
    // 头像
    this.drawBorderCircle(ctx, avatarImage, 49, 366, 30)
    // 昵称
    let name = this.data.postData.nickname
    let nickname = calcStringLen(name) > 12 ? `${splitTargetNoString(name, 11)}..` : name
    ctx.font = `${18}px PingFang SC`
    this.drawName(ctx, nickname, 18, 94, 376, "black")
    // 训练参数
    ctx.save()
    ctx.font = `bold ${30}px Condensed`
    let practiceNo = {
      x: 23,
      y: 420
    }
    this.drawName(ctx, this.data.postData.duration, 30, practiceNo.x, practiceNo.y, 'black')
    ctx.restore()
    // 参数解释
    ctx.save()
    ctx.font = `${14}px Condensed`
    let tipsNo = {
      x: 33,
      y: 455
    }
    this.drawName(ctx, "训练时长", 14, tipsNo.x, tipsNo.y, 'black')
    ctx.restore()
    // 二维码
    ctx.drawImage(qrCodeImage, 222, 376, 68, 68)
    // 提示文案
    let tipNo = {
      x: 221,
      y: 448
    }
    this.drawName(ctx, "长按识别二维码", 10, tipNo.x, tipNo.y, 'black')
    this.drawName(ctx, "一起练习", 10, tipNo.x + 15, tipNo.y + 12, 'black')

    ctx.draw(true, () => {
      wx.hideLoading()
      this.setData({
        _didDrawCanvasDone: true
      }, () => {
        // 如果用户在绘制结束前已经点击"保存图片到本地"，则自动触发saveToLocal
        if (this.data._invokeSaveToLocalAction) {
          this.saveToLocal()
        }
      })
    })
  },
  /**
   * 绘制canvas
   */
  drawCanvas() {
    let {
      cover,
      avatar,
      qrcode
    } = this.data.postData
    let assets = [cover, avatar, qrcode]

    batchDownloadFiles(assets).then(([coverImage, avatarImage, qrCodeImage]) => {
      this.drawHiddenCanvas(coverImage, avatarImage, qrCodeImage, this.data.postData.recordNo)
    })
    // assets.forEach(src => {
    // 	promiseAry.push(new Promise(resolve => {
    // 		wx.getImageInfo({
    // 			src,
    // 			success({path}) {
    // 				resolve(path)
    // 			}
    // 		})
    // 	}))
    // })
    // Promise.all(promiseAry).then(([coverImage, avatarImage, qrCodeImage]) => {
    // 	this.drawHiddenCanvas(coverImage, avatarImage, qrCodeImage, this.data.postData.recordNo)
    // })
  },
  initial() {
    this.drawCanvas()
  },
  saveToLocal() {
    const self = this
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

    this._saveCanvasImageToLocal('mindfulnessOrder').then(({
      tempFilePath
    }) => {
      console.log(tempFilePath)
      queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum)
        .then(() => {
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              toast('图片保存成功', 3000, 'success')
              self.punchCard()
            },
            fail(err) {
              collectError({
                level: ErrorLevel.p1,
                page: "dd.actionPost.saveImageToPhotosAlbum",
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
  },
  // 保存canvas图片到本地
  _saveCanvasImageToLocal(canvasId, x = 0, y = 0, fileType = 'png') {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        x,
        y,
        width: 300,
        height: 480,
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
