import { GLOBAL_KEY } from '../../lib/config'
import { getLocalStorage  } from "../../utils/util";


Page({

  /**
   * 页面的初始数据
   */
  data: {
     statusHeight: 0,
     posterData: {},
     canvasWidth: 0,
     canvasheight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
    // 
    this.initPoster({
      actionName: '完成慈溪的联系',
      continuesDay: 2,
      duration: '03:15'
    })
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
    .exec((res) => {
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
        const url = "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1662716884qfOpmg.jpg"
        // 初始化背景
        this.setData({
          canvasWidth: width,
          canvasheight: height
        })
        this.initBg(canvas,ctx,width,height,url,0,0)
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
      ctx.drawImage(image,15,509,30,30)
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

    // 绘制打卡数据
  initPosterData(canvas,ctx) {
    let { actionName,duration, continuesDay, accountName, accountImage } = this.data.posterData
    let  { canvasWidth, canvasheight } = this.data
    this.drawArc(canvas, ctx,30,524,15,2,accountImage)
    this.drawText(ctx,'13px PingFangSC-Medium',accountName,51,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Regular',actionName,51,526,'#FEFFFF')
    // 连续打卡
    this.drawText(ctx,'12px PingFangSC-Medium',`${continuesDay}天`,canvasWidth - 99,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Medium','连续打卡',canvasWidth - 127,526,'#FEFFFF')
    // 连续打卡右侧线条
    this.initLine(ctx,canvasWidth - 70.5,509,canvasWidth - 70.5,535,1,'#FEFFFF')
    // 训练时长
    this.drawText(ctx,'12px PingFangSC-Medium',`${duration}`,canvasWidth - 45,509,'#FFFFFF')
    this.drawText(ctx,'12px PingFangSC-Medium','训练时长',canvasWidth - 63,526,'#FEFFFF')
  },
})