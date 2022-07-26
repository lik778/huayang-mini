// pages/mindfulnessContent/mindfulnessContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658717120uWYoJQ.jpg'
      },
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658718159VOtNhH.jpg'
      },
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658718257YSlBgP.jpg'
      }
    ],
    partContent1: [
      {
        title: '温柔的觉知',
        content: ['心在当下，带着温柔、不评判的态度觉知当下']
      },
      {
        title: '人在这里，心在这里',
        content: ['心不在焉，就是失去正念，人在这里，但心不在这里；','无意识地做着某件事，或者做一件事，想着另一件事。','具有正念则是相反，是心在焉，人在这里，心在这里。']
      }
    ],
    partContent2: [
      {
      src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658728523FJKEmO.jpg',
      title: '01 可以重塑人的大脑结构',
      content: '大脑结构的相关研究发现，正念冥想与<span style="color: #F43">注意、学习、记忆和情绪等对应的相关脑区</span>（脑岛、海马、扣带回、前额叶等）皮层厚度或灰质密度变化有关。基于 fMRI 或 MRI 技术的研究表明冥想可使前扣带回、顶颞连接部、小脑区域脑灰质密度增加，大脑皮层增厚，产生变化的区域与学习、情感、记忆相关。<div style="width: 100%;height: 20px"></div> 也即是说，正念练习可以<span style="color: #f43">改善或增强我们的认知功能，比如注意力、专注力的提升，记忆力的增强</span>，以及情绪调节能力的提升等。'
      },
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658731094Mrafvd.jpg',
        title: '02 可以有效调节情绪',
        content: '正念冥想可以作为自我调节的手段，有效缓解释放情绪，也能带来更多积极的改变，比如<span style="color: #f43">情绪更稳定，缓解压力、焦虑、抑郁复发、悲伤等情绪问题</span>。<div style="width: 100%;height: 20px"></div> 研究发现，正念练习者的前脑岛、感觉皮层和前额叶皮层的皮质厚度会增加，对感觉刺激的觉察越来越清晰，从而<span style="color: #f43">利用这种自我觉察来应对日常的压力</span> 。<div style="width: 100%;height: 20px"></div>我们知道积极情绪与左侧大脑半球的活动有关，消极情绪与右侧大脑半球的活动有关（Moynihan, 2013），研究表明正念练习者左侧前额叶脑区激活显著增强，而这种增强与<span style="color: #f43">正向情绪增强</span>有关；正念练习还能够显著降低抑郁症的复发率。'
      },
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658731399UFvtRQ.jpg',
        title: '03 可以有效改善睡眠质量',
        content: '研究发现，长期坚持睡前冥想，可有效改善入睡困难、睡眠质量低、浅层睡眠、噩梦等情况。<div style="width: 100%;height: 20px"></div> 原理是，冥想能让你与出现在脑海中的想法和感受保持健康关系，让你不再受情绪和感受的影响，而且通过呼吸冥想，可以启动你的<span style="color: #f43">副交感神经（PNS）的镇定机制</span>；同时正念冥想还可以<span style="color: #f43">提高褪黑素的水平</span>，褪黑素对调节我们的睡眠有很重要的作用。'
      },
      {
        src: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658731658BiIzKn.jpg',
        title: '04 可以延缓衰老',
        content: '正念冥想练习可以延缓衰老。诺贝尔奖获得者正念冥想练习可以延缓衰老。诺贝尔奖获得者伊丽莎白·布莱克本发现，正念冥想能够<span style="color: #f43">减缓端粒的磨损</span>，甚至<span style="color: #f43">可能增加端粒的长度</span>。端粒的长短决定了我们身体的健康 和衰老速度，这意味着正念冥想很可能会让我们的大脑和身体逆生长。'
      },
    ],
    partLastLis: [
      '认识到痛苦的根源，有慈悲心',
      '同理心和感恩能力的增强',
      '自我的接纳与和解',
      '人际关系变得更加和谐',
      '幸福感与幸福能力的提升'
    ],
    partContent3: [
      {
        title: '🎓 正念走进学府',
        content: '经过科学研究，如果学生练习正念冥想，不仅能促进心理健康的建设，记忆力、专注力也会变好。像哈佛大学、斯坦福大学等学校，也都成立了正念冥想研究中心。',
        detail: '（左下图斯坦福正念冥想研究中心）',
        src1: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735424TYnJqr.jpg',
        src2: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735448OHkoRC.jpg'
      },
      {
        title: '🎩 正念走进政坛',
        content: '2017年10月，世界各地的政界人士蜂拥至伦敦，参加由英国议会主办的“正念政治”会议。会议由美国科学家乔·卡巴金领衔，探究正念冥想是否可以帮助各国推动各项事务的发展；<div style="width: 100%;height: 15px"></div> 自2013年以来，已经有145名英国议员参与了为期8周的正念课程，还有来自瑞典、斯里兰卡、匈牙利、法国、荷兰、爱尔兰和意大利的政府官员也体验过冥想；',
        detail: '（左下图 卡巴金教授在英国）',
        src1: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735581dxYBmB.jpg',
        src2: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735493AgMKJX.jpg'
      },
      {
        title: '🛰️ 正念走进商界',
        content: '乔布斯说冥想是他灵感来源，因此才创办了苹果这家伟大的公司。<div style="width: 100%;height: 15px"></div> 谷歌最受欢迎的正念课，每次开课数百人争取。 <div style="width: 100%;height: 15px"></div>卡巴金教授带着达沃斯世界经济论坛与会者做正念冥想。',
        detail: '（右下图：卡巴金教授在达沃斯论坛）',
        src1: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735581dxYBmB.jpg',
        src2: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735493AgMKJX.jpg'
      },
      {
        title: '🏀 正念走进运动',
        content: '越来越多心理学家，鼓励运动员在重大比赛前练习正念冥想。作为备战前的心理准备，冥想可以帮助运动员获得高度集中的注意力，让他们在比赛中更容易进入“行云流水”般的状态，如乔丹、科比、奥尼尔、谷爱凌等等都有过正念冥想训练和练习。',
        detail: '',
        src1: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735924NuIWSr.jpg',
        src2: 'https://huayang-img.oss-cn-shanghai.aliyuncs.com/1658735943JHskJy.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})