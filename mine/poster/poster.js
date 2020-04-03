// mine/poster/poster.js
const {
    wxml,
    style
} = require('./canvasImg.js')
import {createCanvas} from "./canvas"
// const { wxml, style } = require('./demo.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qcCode: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.widget = this.selectComponent('.widget')
        // setTimeout(()=>{
        //     this.renderToCanvas()
        // },300)
        // this.widget = this.selectComponent('.widget')
    },
    renderToCanvas() {
        const p1 = this.widget.renderToCanvas({ wxml, style })
        p1.then((res) => {
          console.log('container', res.layoutBox)
          this.container = res
        })
      },
    /**
     * 事件
     */
    // 渲染canvas
    // renderToCanvas() {
    //     const p1 = this.widget.renderToCanvas({
    //         wxml,
    //         style
    //     })
    //     p1.then((res) => {
    //         this.container = res
    //     })
    // },
    // 保存到相册
    saveAlbum() {
        wx.downloadFile({
            url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1585559408pfSCjI.jpg',
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                            wx.showToast({
                                title: '保存成功',
                                icon: "success",
                                duration: 3000
                            })
                        } else {
                            wx.showToast({
                                title: '保存失败',
                                icon: "none",
                                duration: 3000
                            })
                        }
                    },

                })

            },
            fail(err) {
                console.log(err)
            }
        })
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
        createCanvas()
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
    onShareAppMessage: function (res) {
        console.log(res)
    }
})