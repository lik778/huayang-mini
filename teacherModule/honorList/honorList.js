// teacherModule/honorList/honorList.js
import {
  getTeacherNewHonorList
} from "../../api/teacherModule/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagination: {
      tutor_id: '',
      offset: 0,
      limit: 10
    },
    noData: false,
    honorList: []
  },

  /* 获取荣誉列表 */
  getHonorList(refresh = false) {
    getTeacherNewHonorList(this.data.pagination).then(({
      data
    }) => {
      let list = this.data.honorList.concat()
      list = refresh ? data.list || [] : list.concat(data.list || [])
      this.setData({
        honorList: list,
        noData: data.list ? data.list.length >= this.data.pagination.limit ? false : true : true
      })
      console.log(list)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.teacherId) {
      this.setData({
        ['pagination.tutor_id']: options.teacherId
      }, () => {
        this.getHonorList()
      })
    } else {
      wx.switchTab({
        url: '/pages/discovery/discovery',
      })
    }
  },


  onReachBottom: function () {
    if (!this.data.noData) {
      this.setData({
        ['pagination.offset']: this.data.pagination.offset + this.data.pagination.limit
      }, () => {
        this.getHonorList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})