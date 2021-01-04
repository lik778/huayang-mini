Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    flowerList: [
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936192XCjYWv.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936242rXmtiF.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936320MdBocp.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936332cnebty.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936342XAHoYm.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936353qjdoUg.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936362fchlzo.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936378dzzHod.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936390KIHIuE.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936400GbSmtO.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607936424MLLZPS.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938283eGfFtd.jpg',
        hid: true
      }, {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938294huHbGx.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938308QbEIYj.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938318GVIPTL.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938327pffxBI.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938335sRmNOz.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938346SBwVia.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938361bJurco.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938376TyNsQs.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938387ytghtN.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938396vzTlXX.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938428xfUzpm.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938442KGoFXe.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938456xuruhC.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938471luvoJT.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938482atuSyj.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938496QvudyS.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938506cSecsS.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938520QVOJcm.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938529VpYhIT.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938540ZtwMGx.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938551UBMOXr.jpg',
        hid: true
      },
      {
        url: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1607938563guvhTi.jpg',
        hid: true
      }
    ],
    animateLock: true,
    didVisble: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点赞
    star() {
      this.setData({didVisble: true})
      if (!this.data.animateLock) return;
      let starIndex = 1
      this.setData({animateLock: false})
      let renderTimer = setInterval(() => {
        let flowerList = this.data.flowerList
        let prev = starIndex - 1;
        if (prev >= 0) {
          flowerList[prev].hid = true;
        }
        if (starIndex > 33) {
          flowerList[starIndex - 1].hid = true;
          starIndex = 1;
          this.setData({animateLock: true, didVisble: false})
          clearInterval(renderTimer);
        } else {
          flowerList[starIndex].hid = false;
          starIndex++;
        }
        this.setData({flowerList})
      }, 35);
    },
  }
})
