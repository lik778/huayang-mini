// subCourse/actionPost/actionPost.js
import { getLocalStorage, queryWxAuth } from "../../utils/util"
import { WX_AUTH_TYPE } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  saveToLocal() {
    this._saveCanvasImageToLocal('order').then(({ tempFilePath }) => {
      console.log(tempFilePath);
      queryWxAuth(WX_AUTH_TYPE.writePhotosAlbum).then(() => {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            toast('图片保存成功', 3000, 'success');
          },
          fail() {
            toast('图片保存失败');
          }
        });
      }).catch(() => {
        wx.showModal({
          title: '相册授权',
          content: '保存失败，未获得您的授权，请前往设置授权',
          confirmText: '去设置',
          confirmColor: '#33c71b',
          success(res) {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      });
    });
  },
  // 保存canvas图片到本地
  _saveCanvasImageToLocal(canvasId, x = 0, y = 0, fileType = 'png') {
    let { screenWidth, screenHeight } = getLocalStorage(GLOBAL_KEY.systemParams, true);
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        x,
        y,
        width: screenWidth,
        height: screenHeight,
        canvasId,
        fileType,
        success(result) {
          resolve(result);
        }
      });
    });
  },
})
