// subCourse/applyJoinSchool/applyJoinSchool.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  getLocalStorage
} from "../../utils/util"
import {
  daxueEnter
} from "../../api/course/index"
import {
  GLOBAL_KEY
} from "../../lib/config"
import bxPoint from "../../utils/bxPoint"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backPath: "/pages/practice/practice",
    ageList: ['40～50岁', '51～60岁', '61～70岁', '其他'],
    statusList: ['在职', '退休', '返聘'],
    jobList: ['国家机关/党群组织/企业', "事业单位负责人", '专业技术人员', '商业/服务人员'],
    jobIndex: '',
    hobbyList: [{
      name: '穿搭、美妆、发型',
      checked: false
    }, {
      name: '走秀、舞蹈、瑜伽',
      checked: false
    }, {
      name: '朗诵、唱歌、乐器',
      checked: false
    }, {
      name: '文旅、摄影、阅读',
      checked: false
    }, {
      name: '红酒鉴赏、茶道、花艺',
      checked: false
    }, {
      name: '手工艺品、书法、绘画',
      checked: false
    }],
    hobbyIndex: '',
    formData: {
      real_name: '',
      age_range: '',
      job: "",
      status: "",
      interest: "",
    },
    hobbyArr: [],
    hobbyOther: '',
    jobInputValue: '',
    alertPicker: false,
    lock: true
  },

  // 姓名输入框实时更改
  changeName(e) {
    this.setData({
      ['formData.real_name']: e.detail.value
    })
  },

  // 年龄选择框实时更改
  changeAge(e) {
    let index = Number(e.detail.value)
    this.setData({
      ['formData.age_range']: this.data.ageList[index]
    })
  },

  // 职业选择框实时更改
  changeJob(e) {
    let index = Number(e.currentTarget.dataset.index)
    this.setData({
      jobIndex: index
    })
    if (index !== 4) {
      this.setData({
        ['formData.job']: this.data.jobList[index],
        jobInputValue: ""
      })
    } else {
      this.setData({
        ['formData.job']: ''
      })
    }
  },

  // 职业其他输入框实时更改
  changeJobInput(e) {
    this.setData({
      ['formData.job']: e.detail.value
    })
  },

  // 状态选择框实时更改
  changeStatus(e) {
    console.log(e)
    let index = Number(e.detail.value) + 1
    this.setData({
      ['formData.status']: index === 1 ? 1 : index === 2 ? 3 : 2
    })
  },
  // 兴趣选择框实时更改
  changeHobby(e) {
    let item = this.data.hobbyList[e.currentTarget.dataset.index]
    let arr = this.data.hobbyArr
    let hasRepeat = false
    let repeatIndex = ''
    for (let i in arr) {
      if (arr[i].name === item.name) {
        hasRepeat = true
        repeatIndex = i
      }
    }
    if (!hasRepeat) {
      arr.push(item)
    } else {
      arr.splice(repeatIndex, 1)
    }
    for (let i in this.data.hobbyList) {
      if (this.data.hobbyList[i].name === item.name) {
        this.data.hobbyList[i].checked = hasRepeat ? false : true
        this.setData({
          hobbyList: this.data.hobbyList
        })
      }
    }
    this.setData({
      hobbyArr: arr
    })
    return
  },
  // 改变兴趣选择框下标
  changeHobbyIndex(e) {
    let index = Number(e.currentTarget.dataset.index)
    this.setData({
      hobbyIndex: index
    })
  },
  // 兴趣其他输入框实时更改
  changeHobbyInput(e) {
    this.setData({
      hobbyOther: e.detail.value
    })
  },
  // 保存
  save() {
    let params = this.data.formData
    let arr = []
    for (let i in this.data.hobbyArr) {
      arr.push(this.data.hobbyArr[i].name)
    }
    if (this.data.hobbyOther !== '') {
      arr.push(this.data.hobbyOther)
    }
    params.interest = arr.join(',')
    params.user_id = JSON.parse(getLocalStorage(GLOBAL_KEY.userId))
    let isRight = this.checkParams(params)
    if (this.data.lock && isRight) {
      this.setData({
        lock: false
      })
      daxueEnter(params).then(res => {
        if (res.code === 0) {
          Toast.success({
            message: "您已保存成功\n开始学习吧",
            forbidClick: true,
            duration: 3000,
            onClose: () => {
              wx.navigateTo({
                url: `/subCourse/campDetail/campDetail?id=${this.data.campId}&share=true`,
              })
            }
          });
        } else {
          this.setData({
            lock: true
          })
        }
      }).catch(() => {
        this.setData({
          lock: true
        })
      })
    }

  },
  // 检查参数
  checkParams(e) {
    e.real_name = e.real_name.trim()
    e.job = e.job.trim()
    e.interest = e.interest.trim()
    if (e.real_name === '') {
      Toast({
        message: '请正确填写您的姓名',
        duration: 2500,
        forbidClick: true
      })
      return false
    } else if (e.age_range === '') {
      Toast({
        message: '请选择您的年龄段',
        duration: 2500,
        forbidClick: true
      })
      return false
    } else if (e.status === '') {
      Toast({
        message: '请选择您的状态',
        duration: 2500,
        forbidClick: true
      })
      return false
    } else if (e.job === '') {
      Toast({
        message: '请正确填写您的职业',
        duration: 2500,
        forbidClick: true
      })
      return false
    } else if (e.interest === '') {
      Toast({
        message: '请正确填写您的兴趣',
        duration: 2500,
        forbidClick: true
      })
      return false
    } else {
      return true
    }
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      campId: options.campId
    })
    bxPoint("traincamp_class_checkin")
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
      statusHeight: JSON.parse(getLocalStorage(GLOBAL_KEY.systemParams)).statusBarHeight
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