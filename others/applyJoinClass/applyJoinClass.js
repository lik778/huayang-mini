// others/applyJoinClass/applyJoinClass.js
import {
  getLocalStorage,
  isNumber
} from "../../utils/util"
import {
  daxueEnter
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['中国'],
    index: 0,
    genderList: ['女', '男'],
    lifeStatusList: ['在职', '退休返聘', '已退休'],
    jobList: ['企业管理者/公务员/国企', '事业单位/律师', '医生', '老师等专业工作者/其他'],
    form: {
      real_name: "",
      age: "",
      gender: "",
      status: "",
      job: "",
      stu_mobile: ""
    }
  },

  inputRealName(e) {
    let value = e.detail.value
    this.setData({
      ['form.real_name']: value
    })
    console.log(value)
  },
  inputAge(e) {
    let value = e.detail.value
    this.setData({
      ['form.age']: value
    })
    console.log(value)
  },
  genderChangeTap(e) {
    let index = Number(e.detail.value)
    let value = this.data.genderList[index]
    this.setData({
      ['form.gender']: value
    })
    console.log(value)
  },
  lifeStatusChangeTap(e) {
    let index = Number(e.detail.value)
    let value = this.data.lifeStatusList[index]
    this.setData({
      ['form.status']: value
    })
    console.log(value)
  },
  jobChangeTap(e) {
    let index = Number(e.detail.value)
    let value = this.data.jobList[index]
    this.setData({
      ['form.job']: value
    })
    console.log(value)
  },

  saveTap() {
    console.log(this.data.form)
    let message = this.verifyForm()
    if (message !== true) {
      wx.showToast({
        title: message,
        icon: 'none'
      })
      return
    }
    let form = {
      ...this.data.form
    }
    form.gender = form.gender === '男' ? 1 : 2
    daxueEnter(form).then(() => {
      wx.navigateTo({
        url: '/others/applyJoinClassResult/applyJoinClassResult',
      })
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  },

  verifyForm() {
    let form = {
      ...this.data.form
    }
    if (!form.real_name.trim()) {
      return "请输入正确的姓名"
    } else if (!form.age.trim() || !isNumber(form.age)) {
      return "请输入正确的年龄"
    } else if (!form.gender) {
      return "请选择您的性别"
    } else if (!form.status) {
      return "请选择您的生活状态"
    } else if (!form.job) {
      return "请选择您的职业"
    }
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.mobile || getLocalStorage(GLOBAL_KEY.accountInfo)) {
      this.setData({
        ['form.stu_mobile']: options.mobile || JSON.parse(getLocalStorage(GLOBAL_KEY.accountInfo)).mobile
      })
    } else {
      wx.navigateTo({
        url: '/others/classIntroduce/classIntroduce',
      })
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

})