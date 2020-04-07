export const createCanvas = () => {
  // 获取上下文
  let ctx = wx.createCanvasContext('posterCanvas')
  // 计算设备比
  let systemInfo = wx.getSystemInfoSync()
  let width = systemInfo.screenWidth
  let height = systemInfo.screenHeight

  let radio = Number((width / 750).toFixed(2))
  let src = "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585650569wbTyQK.jpg"
  // 绘制背景矩形
  ctx.setFillStyle('red')
  ctx.fillRect((width - 654 * radio) / 2, 60 * radio,654 * radio, 920 * radio)
  wx.getImageInfo({
    src: src,
    success: function (res) {
      // 绘制圆形头像
      drawCircular(ctx, 100 * radio, 100 * radio, 100 * radio, 100 * radio, res.path, radio)
      // 绘制名字
      dramName(ctx,"您的好友 樊悦",20, 240 * radio,100 * radio,"#000")
      dramName(ctx,"邀您共同赢取花样会员",20, 240 * radio,160 * radio,"#000")
      // 绘制描述语
      // 。。。。
      ctx.draw()
    }
  })
}
// 绘制名字
function dramName(ctx,text,fontSize,x,y,color){
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
  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2 + 5 * radio, 0, Math.PI * 2, false);
  ctx.setFillStyle('#fff')
  ctx.fill()
  ctx.clip();
  ctx.beginPath();
  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
  ctx.restore();
}