import { getDistributeFirstList, getDistributeSecondList } from "../../api/mine/index"
import { getLocalStorage } from "../../utils/util"
import { GLOBAL_KEY } from "../../lib/config"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    currentTab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {index} = options
    if (index) {
      this.setData({currentTab: +index})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList()
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
  // tab按钮点击事件
  onTapChange(e) {
    this.setData({currentTab: +e.currentTarget.dataset.id})
    this.getList()
  },
  getList () {
    let accountInfo = JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo))
    switch (this.data.currentTab) {
      case 1: {
        getDistributeFirstList({
          user_snow_id: accountInfo.snow_id,
          limit: 10,
          offset: 0
        }).then(({data}) => {
          data = data || []
          data = data.map((_) => ({
            isPartner: _.distribute_user ? _.distribute_user.status === 2 : false,
            avatar: _.user.avatar_url,
            nickname: _.user.nick_name,
            date: _.user.created_at
          }))
          this.setData({list: data.slice()})
        })
        break;
      }
      case 2: {
        getDistributeSecondList({
          user_snow_id: accountInfo.snow_id,
          limit: 10,
          offset: 0
        }).then(({data}) => {
          data = data || []
          data = data.map((_) => ({
            isPartner: _ ? _.status === 2 : false,
            avatar: _.avatar_url,
            nickname: _.nick_name,
            date: _.created_at
          }))
          this.setData({list: data.slice()})
        })
        break;
      }
    }
  }
})
