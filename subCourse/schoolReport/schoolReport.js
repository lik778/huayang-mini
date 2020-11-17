// subCourse/schoolReport/schoolReport.js
import {
  getLocalStorage
} from "../../utils/util"
import {
  getUserInfo
} from "../../api/mine/index"
import {
  getCampStageMessgae,
  classCheckin,
  getCampDetail
} from "../../api/course/index"
import bxPoint from "../../utils/bxPoint"

import {
  GLOBAL_KEY
} from "../../lib/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    lock: true
  },

  // 返回
  back() {
    wx.switchTab({
      url: '/pages/practice/practice',
    })
  },

  // 报到
  toResult() {
    if (this.data.lock) {
      this.setData({
        lock: false
      })
      classCheckin({
        user_id: this.data.info.userId,
        traincamp_stage_id: this.data.info.stageId,
        class_num: this.data.info.class_num
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          bxPoint("daxue_enter")
          wx.showToast({
            title: '报到成功',
            icon: "success",
            duration: 3000,
            success: () => {
              setTimeout(() => {
                wx.navigateTo({
                  url: `/subCourse/schoolReportResult/schoolReportResult?data=${JSON.stringify(this.data.info)}`,
                })
              }, 3000)
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            duration: 2000,
            icon: "none"
          })
          this.setData({
            lock: true
          })
        }
      }).catch((err) => {
        console.log(err)
        wx.showToast({
          title: '加入失败',
          duration: 2000,
          icon: "none"
        })
        this.setData({
          lock: true
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      scene,
    } = options
    let sceneAry = ''
    let stage_id = ''
    let class_num = ''
    if (scene) {
      sceneAry = decodeURIComponent(scene).split('/');
      [stage_id = '', class_num = ''] = sceneAry
    } else {
      if (options.stage_id && options.class_num) {
        // 授完权返回
        stage_id = options.stage_id
        class_num = options.class_num
      } else {
        // 没有参数
        wx.navigateTo({
          url: '/pages/discovery/discovery',
        })
        return
      }
    }
    getUserInfo("scene=zhide").then(res => {
      let userInfo = getLocalStorage(GLOBAL_KEY.accountInfo)
      if (userInfo) {
        getCampStageMessgae({
          traincamp_stage_id: stage_id
        }).then(res1 => {
          console.log(res1)
          getCampDetail({
            traincamp_id: res1.data.stage.kecheng_traincamp_id
          }).then(res => {
            this.setData({
              info: {
                name: res.name,
                date: res1.data.stage.date,
                class_num: class_num,
                stageId: stage_id,
                campId: res1.data.stage.kecheng_traincamp_id,
                userId: getLocalStorage(GLOBAL_KEY.userId)
              }
            })
          })
        })
      } else {
        let redirectPath = `/subCourse/schoolReport/schoolReport?stage_id=${stage_id}&class_num=${class_num}`
        redirectPath = encodeURIComponent(redirectPath)
        wx.navigateTo({
          url: `/pages/auth/auth?redirectPath=${redirectPath}&needDecode=true`,
        })
      }
    }).catch((err) => {
      let redirectPath = `/subCourse/schoolReport/schoolReport?stage_id=${stage_id}&class_num=${class_num}`
      redirectPath = encodeURIComponent(redirectPath)
      wx.navigateTo({
        url: `/pages/auth/auth?redirectPath=${redirectPath}&needDecode=true`,
      })
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

    this.setData({
      statusBarHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
    })
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