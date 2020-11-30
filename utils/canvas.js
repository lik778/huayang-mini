// 绘制文字
export const drawFont = (ctx, text, fontColor, fontWeight = 'normal', fontFamily, fontSize, x, y) => {
  return new Promise(resolve => {
    ctx.save()
    ctx.setTextBaseline('top')
    ctx.setTextAlign('left')
    ctx.font = `normal ${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.setFillStyle(fontColor)
    ctx.fillText(text, x, y)
    ctx.restore()
    resolve()
  })
}

// 绘制图片
export const drawImage = (ctx, imageSrc, x, y, width, height) => {
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
}

// 专门适配两张图片居中绘制并且识别横竖图,其他情况勿用
export const drawImageAuto = async (ctx, imageSrc1, imageSrc2) => {
  let rowWidth = 62 //宽图宽
  let rowHeight = 20 //宽图高
  let colWidth = 26 //长图宽
  let colHeight = 26 //长图高
  let rowX = 72 //宽图第一张图x
  let rowX2 = 150 //宽图第二张图x
  let rowY = 70 //宽图统一y
  let colX = 112 //长图第一张图x
  let colX2 = 148 //长图第二张图x
  let colY = 68 //长图统一y
  // 第一张图
  await drawImageFun(ctx, imageSrc1, rowWidth, rowHeight, colWidth, colHeight, rowX, colX, rowY, colY)
  // 第二张图
  await drawImageFun(ctx, imageSrc2, rowWidth, rowHeight, colWidth, colHeight, rowX2, colX2, rowY, colY)
  return new Promise(resolve => {
    resolve()
  })
}

// 绘制图片公用方法
export const drawImageFun = (ctx, src, rowWidth, rowHeight, colWidth, colHeight, rowX, colX, rowY, colY) => {
  return new Promise(resolve => {
    wx.downloadFile({
      url: src,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: (res1) => {
              ctx.save()
              if (res1.width > res1.height) {
                // 横图
                ctx.drawImage(res.tempFilePath, rowX, rowY, rowWidth, rowHeight)
              } else {
                // 竖图
                ctx.drawImage(res.tempFilePath, colX, colY, colWidth, colHeight)
              }
              ctx.restore()
              resolve()
            }
          })
        }
      }
    })
  })
}

// 绘制矩形
export const drawRact = (ctx, x, y, width, height, bg) => {
  return new Promise(resolve => {
    ctx.save()
    ctx.rect(x, y, width, height)
    ctx.setFillStyle(bg)
    ctx.fill()
    ctx.restore()
    resolve()
  })
}

// 绘制直线
export const drawLine = (context, color, height, beginX, beginY, endX, endY) => {
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
}

// 计算字体宽度
export const measureTextWidth = (ctx, text) => {
  return ctx.measureText(text).width
}

// 绘制边框圆形头像
export const drawBorderCircle = (ctx, url, x, y, r) => {
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
}