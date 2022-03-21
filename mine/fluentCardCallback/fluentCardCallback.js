import bxPoint from "../../utils/bxPoint"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    didShowContact: false,free:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.free) {
      this.setData({
        free:true
      })
      // jj-2022-03-21梨花
      bxPoint("changxue_free_get_success", {})
    } else {
      bxPoint("changxue_card_buy_success", {})
    }
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
  onBtnTap() {
    this.setData({
      didShowContact: true
    })
    bxPoint("changxue_card_buy_contact", {}, false)
    bxPoint("join_chat", {})
  },
  onCloseContactModal() {
    this.setData({
      didShowContact: false
    })
  },
  onContactLogoTap() {
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc16674b49d8f7dc5f'
      },
      corpId: 'ww8d4cae43fb34dc92',
      complete:()=>{
        // jj-2022-03-21梨花
        if(this.data.free){
          bxPoint("changxue_free_get_success_contact", {}, false)
        }
      }
    })
  },
})