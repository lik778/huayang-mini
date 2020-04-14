export const createCanvas = ({
  bgUrl,
  nickname,
  num,
  headicon
}) => {
  return new Promise(resolve => {
    // 获取上下文
    let ctx = wx.createCanvasContext('posterCanvas')
    // 计算设备比
    let systemInfo = wx.getSystemInfoSync()
    let width = systemInfo.screenWidth
    let height = systemInfo.screenHeight
    let radio = 1
    ctx.scale(3.37, 3.37)
    // 绘制背景图
    console.log(bgUrl, headicon)

    // ctx.drawImage(bgUrl, 0, 0, 267, 356)
    // // 绘制圆形头像
    // drawCircular(ctx, 34, 34, 12, 18, headicon, radio)
    // // 绘制名字
    // dramName(ctx, `您的好友 ${nickname}`, 14, 57, 18, "#fff")
    // dramName(ctx, "我刚刚成为花样汇俱乐部第 ", 9, 57, 39, "#DDDDDD")
    // dramName(ctx, ` ${num} `, 18, 168, 33, "#DDDDDD")
    // dramName(ctx, "位会员", 9, 200, 39, "#DDDDDD")
    // dramName(ctx, "邀您一起成为时尚达人", 9, 57, 52, "#DDDDDD")
    // // 绘制价格
    // dramName(ctx, "原价199元", 12, 12, 297, "#fff")
    // drawLine(ctx, "#fff", 1, 12, 302, 68, 302)
    // dramName(ctx, "限时99", 24, 12, 316, "#EE0000")
    // dramName(ctx, "元/年", 12, 108, 324, "#EE0000")
    // //绘制小程序二维码
    // drawHeadImg(ctx, 64, 64, 191, 242, headicon, radio)
    // // 绘制完成开成开始导出
    // ctx.draw(false, () => {
    //   wx.canvasToTempFilePath({
    //     canvasId: 'posterCanvas',
    //     success: function (res) {
    //       let tempFilePath = res.tempFilePath;
          
    //       resolve(tempFilePath)
    //     },
    //     fail: function (res) {
    //       console.log(res);
    //     }
    //   });
    // })




    wx.getImageInfo({
      src: bgUrl,
      success: function (bg) {
        ctx.drawImage(bg.path, 0, 0, 267, 356)
        wx.getImageInfo({
          src: headicon,
          success: function (res) {
            // 绘制圆形头像
            drawCircular(ctx, 34, 34, 12, 18, res.path, radio)
            // 绘制名字
            dramName(ctx, `您的好友 ${nickname}`, 14, 57, 18, "#fff")
            dramName(ctx, "我刚刚成为花样汇俱乐部第 ", 9, 57, 39, "#DDDDDD")
            dramName(ctx, ` ${num} `, 18, 168, 33, "#DDDDDD")
            dramName(ctx, "位会员", 9, 200, 39, "#DDDDDD")
            dramName(ctx, "邀您一起成为时尚达人", 9, 57, 52, "#DDDDDD")
            // 绘制价格
            dramName(ctx, "原价199元", 12, 12, 297, "#fff")
            drawLine(ctx, "#fff", 1, 12, 302, 68, 302)
            dramName(ctx, "限时99", 24, 12, 316, "#EE0000")
            dramName(ctx, "元/年", 12, 108, 324, "#EE0000")
            //绘制小程序二维码
            wx.getImageInfo({
              src: headicon,
              success: function (res1) {
                drawHeadImg(ctx, 64, 64, 191, 242, res1.path, radio)
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
                  });
                })
              }
            })


          }
        })
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
// 绘制图片
function drawImage(ctx, url, width, height, x, y) {
  ctx.save();
  ctx.drawImage(url, x, y, width, height);
  ctx.restore();
}
// 绘制含有边框的圆形头像
function drawCircular(ctx, width, height, x, y, url, radio) {
  //第一个参数：创建的画布对象//第二个参数：矩形的宽//第三个参数：矩形的高
  //第四个参数：矩形左上角x轴坐标点，//第五个参数：矩形左上角y轴坐标点，//第六个参数：绘制的图片的URL
  let avatarurl_width = width;
  let avatarurl_heigth = height;
  let avatarurl_x = x;
  let avatarurl_y = y;
  ctx.save();
  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2 + 2 * radio, 0, Math.PI * 2, false);
  ctx.setFillStyle('#fff')
  ctx.fill()
  ctx.clip();
  ctx.beginPath();
  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
  ctx.restore();
}
// 绘制圆形头像
function drawHeadImg(ctx, width, height, x, y, url, radio) {
  //第一个参数：创建的画布对象//第二个参数：矩形的宽//第三个参数：矩形的高
  //第四个参数：矩形左上角x轴坐标点，//第五个参数：矩形左上角y轴坐标点，//第六个参数：绘制的图片的URL
  let avatarurl_width = width;
  let avatarurl_heigth = height;
  let avatarurl_x = x;
  let avatarurl_y = y;
  ctx.save();
  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
  ctx.restore();
}