export const createCanvas = ({
  bgUrl,
  nickname,
  num,
  headicon,
  qcCode,
  noteText
}) => {
  return new Promise(resolve => {
    // 获取上下文
    let ctx = wx.createCanvasContext('posterCanvas')
    // 计算设备比
    ctx.scale(3.37, 3.37)
    wx.downloadFile({
      url: bgUrl,
      success: function (bg) {
        ctx.drawImage(bg.tempFilePath, 0, 0, 267, 356)
        wx.downloadFile({
          url: headicon,
          success: function (res) {
            // 绘制圆形头像
            drawBorderCircle(ctx, res.tempFilePath, 30, 36, 17)
            // 绘制名字
            dramName(ctx, `您的好友 ${nickname}`, 14, 57, 18, "#fff")
            dramName(ctx, "我刚刚成为花样汇俱乐部第 ", 9, 57, 39, "#DDDDDD")
            let textWidth = measureTextWidth("我刚刚成为花样汇俱乐部第 ", ctx)
            dramName(ctx, ` ${num} `, 18, 57 + textWidth, 33, "#DDDDDD")
            let textWidth1 = measureTextWidth(` ${num} `, ctx)
            dramName(ctx, "位会员", 9, textWidth1 + 57 + textWidth, 39, "#DDDDDD")
            dramName(ctx, "邀您一起成为时尚达人", 9, 57, 52, "#DDDDDD")
            // 绘制价格
            dramName(ctx, "原价199元", 12, 12, 297, "#fff")
            drawLine(ctx, "#fff", 1, 12, 302, 68, 302)
            dramName(ctx, "限时99", 24, 12, 314, "#FFCC88")
            let textWidth2 = measureTextWidth(`限时99`, ctx)
            dramName(ctx, "元/年", 12, textWidth2 + 12, 324, "#FFCC88")
            dramName(ctx, "长按识别", 9, 205, 328, "#DDDDDD")
            dramName(ctx, "了解更多会员权益", 9, 187, 339, "#DDDDDD")
            // 绘制活动日期
            dramName(ctx, noteText, 6, 4, 346, "#fff")
            //绘制小程序二维码
            wx.downloadFile({
              url: qcCode,
              success: function (res1) {
                drawBorderCircle(ctx, res1.tempFilePath, 222, 283, 33)
                // 绘制完成开成开始导出
                ctx.draw(false, () => {
                  wx.canvasToTempFilePath({
                    canvasId: 'posterCanvas',
                    success: function (res2) {
                      let tempFilePath = res2.tempFilePath;
                      resolve(tempFilePath)
                    },
                    fail: function (res) {
                      console.log(res);
                    }
                  }, this);
                })
              }
            })
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  })
}

// 绘制直线
function drawLine(context, color, height, beginX, beginY, endX, endY) {
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

// 绘制名字
function dramName(ctx, text, fontSize, x, y, color) {
  ctx.setTextBaseline('top')
  ctx.setFillStyle(color)
  ctx.setFontSize(fontSize)
  ctx.fillText(text, x, y)
}

// 计算字体宽度
function measureTextWidth(text, ctx) {
  return ctx.measureText(text).width
}

// 绘制边框圆形头像
function drawBorderCircle(ctx, url, x, y, r) {
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
}