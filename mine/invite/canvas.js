export const createCanvas = (bgUrl) => {
  return new Promise(resolve => {
    // 获取上下文
    let ctx = wx.createCanvasContext('posterCanvas')
    // 计算设备比
    let systemInfo = wx.getSystemInfoSync()
    let width = systemInfo.screenWidth
    let height = systemInfo.screenHeight
    let radio = 1
    let src = "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585650569wbTyQK.jpg"
    wx.getImageInfo({
      src: bgUrl,
      success: function (bg) {
        console.log(bg.path)
        ctx.drawImage(bg.path, 0, 0, 267, 356)
        // 绘制背景矩形
        wx.getImageInfo({
          src: src,
          success: function (res) {
            // 绘制圆形头像
            drawCircular(ctx, 34, 34, 12, 18, res.path, radio)
            // 绘制名字
            dramName(ctx, "您的好友 樊悦", 14, 57, 18, "#fff")
            dramName(ctx, "我刚刚成为花样汇俱乐部第 ", 9, 57, 34, "#DDDDDD")
            dramName(ctx, " 888 ", 18, 130, 34, "#DDDDDD")
            dramName(ctx, "位会员", 9, 200, 34, "#DDDDDD")
            dramName(ctx, "邀您一起成为时尚达人", 9, 57, 52, "#DDDDDD")
            // 绘制价格
            dramName(ctx, "原价199元",12, 12, 297, "#fff")
            
            dramName(ctx, "限时19.9",24, 12, 316, "#EE0000")
            dramName(ctx, "元/年",12, 108, 324, "#EE0000")
            // 。。。。
            ctx.draw(false, (res) => {
              wx.canvasToTempFilePath({
                canvasId: 'posterCanvas',
                success: function (res) {
                  // console.log('先保存在本地', res.tempFilePath);
                  let tempFilePath = res.tempFilePath;
                  console.log(tempFilePath)
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

  })
}



// 绘制名字
function dramName(ctx, text, fontSize, x, y, color) {
  ctx.setTextBaseline('top')
  ctx.setFillStyle(color)
  ctx.setFontSize(fontSize)
  ctx.fillText(text, x, y)
}

// 绘制圆形头像
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