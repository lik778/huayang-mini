// mine/joinResult/joinResult.js
import {
  getUserInfo,
  getScene
} from "../../api/mine/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import {
  getLocalStorage,
  setLocalStorage
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    statusHeight: 0,
    width: 0,
    height: 0,
    radio: 0,
    bottom: 0,
    showSuccess: false,
    isFirst: false
  },
  // 添加班主任
  addTeacher() {
    if (this.data.isFirst) {
      this.setData({
        showSuccess: true,
        isFirst:false
      })
    }
  },
  // 获取用户信息
  getUserInfoData() {
    getUserInfo("scene=zhide").then(res => {
      if (res.code !== -2) {
        res.zhide_start_time = res.zhide_start_time.replace(/-/g, ".").split(" ")[0]
        setLocalStorage(GLOBAL_KEY.accountInfo,res)
        this.setData({
          userInfo: res || {}
        })
      }
    })
  },
  onClickHide(e) {
    console.log(e)
    if (e.currentTarget.dataset.index === "1") {
      this.setData({
        showSuccess: false
      })
    }

  },
  // 获取班主任号
  changeScene() {
    let params = {
      scene: "daxue",
      open_id: getLocalStorage(GLOBAL_KEY.openId)
    }
    getScene(params)
  },
  // 获取屏幕宽高以及设备比
  getSystemInfo() {
    let info = {
      width: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenWidth,
      height: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).screenHeight,
    }
    if(info.height<667){
      this.setData({
        bottom:-1
      })
    }else if (info.width - 40 < (info.height - 183) / 1.5) {
      this.setData({
        width: info.width - 40,
        height: (info.width - 40) * 1.5,
        radio: (info.width - 40) / 319,
        bottom: 54
      })
    } else {
      this.setData({
        width: (info.height - 183) / 1.5,
        height: info.height - 183,
        radio: (info.width - 40) / 484,
        bottom: 20
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo()
    this.setData({
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
    if (!getLocalStorage(GLOBAL_KEY.addTeacher)) {
      this.setData({
        isFirst: true
      })
      setLocalStorage(GLOBAL_KEY.addTeacher, "false")
    }
    setLocalStorage(GLOBAL_KEY.updateAccountInfo, "true")
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
    this.getUserInfoData()
    this.changeScene()
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

  }
})
