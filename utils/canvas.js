// 绘制文字
export const drawFont = (ctx, text, fontColor, fontWeight = 'normal', fontFamily, fontSize, x, y) => {
  return new Promise(resolve => {
    ctx.save()
    ctx.setTextBaseline('top')
    ctx.setTextAlign('left')
    ctx.setFontSize(fontSize)
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
export const drawImageAuto = (ctx, imageSrc1, imageSrc2) => {
  return new Promise(async resolve1 => {
    // 第一张图
    let imgInfo1 = await new Promise(resolve => {
      wx.downloadFile({
        url: imageSrc1,
        success: (res1) => {
          if (res1.statusCode === 200) {
            wx.getImageInfo({
              src: res1.tempFilePath,
              success: (res2) => {
                let obj = {
                  src: res1.tempFilePath,
                  width: res2.width,
                  height: res2.height,
                }
                resolve(obj)
              }
            })
          }
        }
      })
    })
    let imgInfo2 = await new Promise(resolve => {
      wx.downloadFile({
        url: imageSrc2,
        success: (res1) => {
          if (res1.statusCode === 200) {
            wx.getImageInfo({
              src: res1.tempFilePath,
              success: (res2) => {
                let obj = {
                  src: res1.tempFilePath,
                  width: res2.width,
                  height: res2.height,
                }
                resolve(obj)
              }
            })
          }
        }
      })
    })
    let drawData = await drawImageFun(ctx, imgInfo1, imgInfo2)
    resolve1(drawData)
  })
}

// 绘制图片公用方法
export const drawImageFun = (ctx, imgInfo1, imgInfo2) => {
  return new Promise(resolve => {
    let imgWidth1 = ''
    let imgHeight1 = ''
    let imgY1 = ''
    let imgY2 = ''
    let imgWidth2 = ''
    let imgHeight2 = ''
    let imgIsRow1 = true
    if (imgInfo1.width > imgInfo1.height) {
      // 横图
      imgWidth1 = 62
      imgHeight1 = 20
      imgY1 = 70
      imgIsRow1 = true
    } else {
      // 竖图
      imgWidth1 = 26
      imgHeight1 = 26
      imgY1 = 68
      imgIsRow1 = false
    }

    if (imgInfo2.width > imgInfo2.height) {
      // 横图
      imgWidth2 = 62
      imgHeight2 = 20
      imgY2 = 70
    } else {
      // 竖图
      imgWidth2 = 26
      imgHeight2 = 26
      imgY2 = 68
    }
    if (imgIsRow1) {
      imgWidth1 = imgWidth2 = 62
      imgHeight1 = imgHeight2 = 20
      imgY1 = imgY2 = 70
      let imgTotalWidth = imgWidth1 + imgWidth2
      let a = (270 - imgTotalWidth) / 2
      ctx.drawImage(imgInfo1.src, a, imgY1, imgWidth1, imgHeight1)
      ctx.drawImage(imgInfo2.src, a + imgWidth1 + 16, imgY2, imgWidth2, imgHeight2)
    } else {
      imgWidth1 = imgWidth2 = 26
      imgHeight1 = imgHeight2 = 26
      imgY1 = imgY2 = 68
      let imgTotalWidth = imgWidth1 + imgWidth2
      let a = (276 - imgTotalWidth) / 2
      ctx.drawImage(imgInfo1.src, a, imgY1, imgWidth1, imgHeight1)
      ctx.drawImage(imgInfo2.src, a + imgWidth1 + 10, imgY2, imgWidth2, imgHeight2)
    }
    resolve(imgIsRow1)
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


// 绘制不带边框圆形头像
export const drawCircleHeadIcon = (ctx, url, x, y, r) => {
  return new Promise(resolve => {
    // ctx: 上下文;url: 图片地址;x: 圆中心x位置;y: 圆中心y位置;r: 圆半径
    // 保存上下文
    ctx.save()
    //画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.beginPath(); //开始绘制
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.clip();
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

// 绘制圆形纯色
export const drawCircleFill = (ctx, color, x, y, r) => {
  return new Promise(resolve => {
    ctx.save()
    ctx.beginPath(); // 开始绘制
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.setFillStyle(color)
    ctx.fill()
    ctx.restore()
    resolve()
  })
}
