import { GLOBAL_KEY , WX_AUTH_TYPE, ErrorLevel} from '../../lib/config'
import { getLocalStorage, queryWxAuth , toast } from "../../utils/util";
import {
  collectError
} from "../../api/auth/index"
import {
  queryPunchCardBg,
} from "../../api/course/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
     statusHeight: 0,
     posterData: {},
     canvasWidth: 0,
     canvasheight: 0,
     qrCode: '',
     _didDrawCanvasDone: false,
     _invokeSaveToLocalAction: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight,
      qrCode: options.qrCode
      // qrCode: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/user_avatar_2557.jpg'
    })

    this.initPoster({
      actionName: options.actionName,
      continuesDay: options.continuesDay,
      duration: options.duration
    })
    // this.initPoster({
    //   actionName: '121',
    //   continuesDay: 2,
    //   duration: '00:00',
    // })
    let timer = setTimeout(() => {
      this.initCanvas()
      clearInterval(timer)
    },17)
  },

  // 初始化canvas
  initCanvas() {
    wx.createSelectorQuery()
    .select('#myCanvas') // 在 WXML 中填入的 id
    .fields({ node: true, size: true })
    .exec( async (res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        const url = "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1663048449lZDjVj.jpg"
        // const url = 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1662716884qfOpmg.jpg'

        // let url =  await queryPunchCardBg()
        
        // 初始化背景
        this.setData({
          canvasWidth: width,
          canvasheight: height,
          canvas: canvas
        })
        this.initBg(canvas,ctx,width,width / 0.616,url,0,0)
        // 初始化打卡数据
        // this.initPosterData(canvas,ctx)
        
    })
  },

  // 绘制背景图片
  initBg(canvas,ctx,width,height,src,x,y) {
    ctx.beginPath()
    let image = canvas.createImage()
    image.onload = () => {
      ctx.beginPath()
      // ctx.fillRect(0,0,width,height)
      ctx.drawImage(image, x, y, width,height)
      this.initPosterData(canvas,ctx)
    }
    image.src = src
  },

  // 绘制线条
  initLine(ctx,x1,y1,x2,y2,width,color) {
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.stroke()
    ctx.closePath
  },

  // 绘制文字
  drawText(ctx,font,text,x,y,color) {
    ctx.beginPath()
    ctx.font = font
    ctx.fillStyle = color
    ctx.textBaseline = 'top'
    ctx.fillText(text,x,y)
    ctx.closePath()
  },

  // 绘制矩形
  drawRect(ctx,x,y,width,height,color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x,y,width,height)
  },
  // 绘制 1/4 圆
  drawArc4(ctx,x,y,r,px,py,color) {
    ctx.beginPath()
    ctx.arc(x,y,r,px,py)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  },

  //  裁剪圆
  drawArc(canvas,ctx,x,y,r,width,accountImage) {
    ctx.beginPath()
    let image = canvas.createImage()
    image.onload = () => {
      ctx.beginPath()
      ctx.save()
      ctx.beginPath()
      ctx.arc(x,y,r,0,Math.PI * 2)
      ctx.lineWidth = width
      ctx.strokeStyle = '#fff'
      ctx.stroke()
      ctx.clip()
      // ctx.fillStyle = 'pink'
      // ctx.fillRect(15,509,30,30)
      ctx.drawImage(image,20,507,30,30)
      // 背景图片-
      // this.initBg(canvas,ctx,30,30,accountImage,15,509)
      ctx.closePath()
      ctx.restore()
    }
    image.src = accountImage
    ctx.closePath()
  },

  // 初始化海报数据
  initPoster({ actionName, continuesDay, duration }) {
    let accountInfo  = getLocalStorage(GLOBAL_KEY.accountInfo) ? JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)) : {}
     let  data = {
      actionName,
      duration,
      continuesDay,
      accountName: accountInfo.nick_name,
      accountImage: accountInfo.avatar_url
    }
    this.setData({
      posterData: data
    })
  },

  // 绘制图片
  drawImag(canvas,ctx,src,x,y,width,height) {
    let drawImag = canvas.createImage()
    drawImag.onload = () => {
      ctx.beginPath()
      ctx.drawImage(drawImag, x, y, width, height)
      ctx.closePath()
    }
    drawImag.src = src
  },

    // 绘制打卡数据
  initPosterData(canvas,ctx) {
    let { actionName,duration, continuesDay, accountName, accountImage } = this.data.posterData
    let  { canvasWidth, canvasheight } = this.data
    this.drawArc(canvas, ctx,35,522,15,2,accountImage)
    this.drawText(ctx,'13px PingFangSC-Medium',accountName,56,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Regular',actionName,56,526,'#888888')
    // 连续打卡
    this.drawText(ctx,'13px PingFangSC-Medium',`${continuesDay}天`,canvasWidth - 105,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Medium','连续打卡',canvasWidth - 132,526,'#888888')
    // 连续打卡右侧线条
    this.initLine(ctx,canvasWidth - 75.5,509,canvasWidth - 75.5,539,1,'#888888')
    // 训练时长
    this.drawText(ctx,'13px PingFangSC-Medium',`${duration}`,canvasWidth - 55,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Medium','训练时长',canvasWidth - 68,526,'#888888')

    // 绘制边角矩形
    this.drawArc4(ctx,8,587,8,  0 , 2 * Math.PI, '#ffffff')
    this.drawArc4(ctx,canvasWidth - 8,587,8, 0 , 2 * Math.PI, '#ffffff')
    this.drawRect(ctx,8,579,canvasWidth - 16,8,'#ffffff')
    // 绘制矩形
    this.drawRect(ctx,0,587,canvasWidth,132,'#ffffff')
    // 绘制分享二维码

    let imageQr = canvas.createImage()
    imageQr.onload = () => {
      ctx.beginPath()
      ctx.drawImage(imageQr, 25.76, 609, 62,62)
    }
    imageQr.src = this.data.qrCode
    ctx.closePath()
    this.drawImag(canvas,ctx,'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1663052076aZmEDf.jpg',102,617,221,13)
    this.drawImag(canvas,ctx,'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1663052242qycokz.jpg',102,649,128,13)
    // 我在花样百姓 一 正念生活，花样人生-canvas对文本的操作api少，使用图片代替文字
    // this.drawText(ctx,'bold 13px PingFangSC-Medium','我在',100,617,'#333333')
    // this.drawText(ctx,'bold 13px PingFangSC-Medium','花样百姓',126,617,'#FF5544')
    // this.drawText(ctx,'bold 13px PingFangSC-Medium','花样百姓',126,617,'#FF5544')
    // 线条
    this.initLine(ctx,102.5,639,canvasWidth - 15,639,1,'#EEEEEE')
    // 长按扫码立即学习

    // 绘制完成了
      this.setData({
        _didDrawCanvasDone: true
      },() => {
        if(this.data._invokeSaveToLocalAction) {
          this.savePoster()
        }
      })
  },

  // 保存图片
  savePoster() {
    let { canvasWidth, canvasheight, canvas } = this.data
    // 保存前先判断是否已经绘制完毕，绘制完继续往下走，没有绘制完需要等待绘制完成之后再调用该函数
    if(!this.data._didDrawCanvasDone) {
      this.setData({
        _invokeSaveToLocalAction: true
      })
      return
    }
    
    this.saveCanvasImageTolocal(canvas,0,68,canvasWidth,636).then(({ tempFilePath }) => {
      wx.hideLoading()
      console.log(tempFilePath)
      queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum).then(() => {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            toast('图片保存成功', 3000, 'success')
          },
          fail(error) {
            toast('图片保存失败')
            collectError({
              level: ErrorLevel.p1,
              page: "dd.actionPost.saveImageToPhotosAlbum",
              error_code: 400,
              error_message: error
            })
          }
        })
      })
    }).catch(() => {
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
  },

  // 生成图片临时目录

  saveCanvasImageTolocal(canvas,x,y,width,height) {
    return new Promise((resolve,reject) => {
      wx.showLoading({
        title: '海报生成中...',
        mask: true
      })
      wx.canvasToTempFilePath({
        x: x,
        y: y,
        width: width,
        height: height,
        canvas: canvas,
        success(result) {
          resolve(result)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
})