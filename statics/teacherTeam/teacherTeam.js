import bxPoint from "../../utils/bxPoint";
import {getTeacherList  } from "../../api/course/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherList: [
      {
        category: "幸福课导师",
        teachers: [
          { name: "花花", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644817655qPcPQX.jpg", course: "「第二人生幸福课」导师", resume: ["百姓网CEO", "花样百姓创始人&CEO", "华东师范大学工商管理学士", "中欧国际商学院EMBA15级"]},
          { name: "Dana", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1645670697Ylewjn.jpg", course: "「第二人生幸福课」导师", resume: ["国际认证的NLP高级执行师，\n情商教练，大脑科学领导力教\n练, 共享领导力团队教练", "中欧商学院外聘EMBA教练", "行业领先跨国企业全球高管团\n队教练"]},
        ]
      },
      {
        category: "形体类课程导师",
        teachers: [
          { name: "白勇程", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1648894350eEUgnC.jpg", course: "「模特走秀」导师", resume: ["MCFA模特教学体系高级考官", "荣获CCTV模特电视大赛全国\n季军", "10年以上专业模特教学经验"]},
          { name: "冯珂", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1648894211InCeNp.jpg", course: "「模特走秀」导师", resume: ["资深超模，新丝路、英模签约\n模特", "2009年世界小姐江苏区冠军", "新丝路模特大赛全国十佳"]},
          { name: "杨沐妮", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1648894244hIihUU.jpg", course: "「模特&舞蹈」导师", resume: ["拥有7年模特&舞蹈专业教学\n经验", "卫视春晚等大型盛典节目编\n舞设计经验", "MBA模特大赛亚军"]},

          { name: "严曼宁", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1648894272oZKdAb.jpg", course: "「模特&舞蹈」导师", resume: ["中国舞十三级、芭蕾舞六级", "8年模特行业背景，火石签约\n模特", "拥有丰富舞蹈&走秀双专业带\n教经验"]},
          { name: "喻婧媛", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1648894292HKzVRG.jpg", course: "「女团舞蹈」导师", resume: ["擅长Hip-hop、Urban、Jazz等专业舞种", "参与COSM等知名时尚盛典\n编排及表演", "合作明星：张艺兴、吴昕、\n张碧晨等"]},

          { name: "付一杨", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644818345kPaXZv.jpg", course: "「形体芭蕾」导师", resume: ["前香港芭蕾舞团演员", "2015年南非国际芭蕾舞大赛\n铜奖", "第三届北京国际芭蕾舞暨编\n导大赛银奖", "上海戏剧学院毕业"]},
          { name: "李楠", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644818443iNJIYS.jpg", course: "「尊巴舞蹈」导师", resume: ["尊巴国际认证教练", "国家级健身指导员", "亚洲体适能健身教练", "IDANCE课程创始人", "莱美认证教练"]},
          { name: "陈顾榕", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644818626ZisSWX.jpg", course: "「经络瑜伽」导师", resume: ["明星私人瑜伽教练", "上海Flame Yoga连锁瑜伽\n品牌创始人", "出版书籍《办公室瑜伽》\n《随时随地瑜伽》", "全美瑜伽联盟E-RYT500小\n时认证导师"]},
          { name: "戴汶欣", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644818835WaKnbE.jpg", course: "「古典舞」导师", resume: ["海外桃李杯优秀指导教师节", "上海戏剧学院古典舞专业", "古典舞专业教师"]},
          { name: "李晨", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644818980irwGFF.jpg", course: "「舒缓瑜伽」导师", resume: ["一首瑜伽创始人", "十年旅美瑜伽导师", "学贯中西瑜伽", "健康生活运动理念倡导者"]},
          { name: "王静妮", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819102cImTOg.jpg", course: "「助眠瑜伽」导师", resume: ["美国加州伊莎兰学院首位中\n国导师", "美国瑜伽联盟认证导师", "芳疗师"]},
          { name: "诺思", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819170ixKTHM.jpg", course: "「静心瑜伽」导师", resume: ["美籍华裔瑜伽导师", "练习瑜伽7年", "500小时瑜伽培训资质", "双语教学"]},
          { name: "徐徐", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819292qbtftL.jpg", course: "「弹力带健身操」导师", resume: ["健身及辅导糖友运动15年", "冷暖医学媒体主编", "原小猎犬APP健康频道主编", "原《糖尿病之友》杂质资深\n编辑"]},
        ]
      },
      {
        category: "时尚类课程导师",
        teachers: [
          { name: "樊悦", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819351mRQfwy.jpg", course: "「时尚穿搭」导师", resume: ["明星造型搭配顾问", "原Onlylady女人志资深\n编辑", "原阿里集团优酷土豆资深\n编辑", "花样百姓时尚主编"]},
          { name: "李璐羽", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819420YkWCOr.jpg", course: "「美妆发型」导师", resume: ["明星化妆师", "上海戏剧学院讲师", "上海电视台春晚特邀化妆师", "上海世博会开幕活动特邀化\n妆师"]},
          { name: "Candy", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819508DDOBaX.jpg", course: "「时尚穿搭」导师", resume: ["HARDcANDY Agency创始人", "《我就这样穿》电视节目主\n理人&出版物作者", "「了不起的你」买手店联合\n创始人", "多所院校特邀时尚讲师", "留英国际时装营销硕士"]},
          { name: "马晓娟", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819560wGwuzA.jpg", course: "「时尚穿搭」导师", resume: ["英国CMB国际色彩顾问", "美国AICI顾问协会会员", "15小时场合着装推广大使", "上海嘉乙文化主理人"]},
        ]
      },
      {
        category: "声乐类课程导师",
        teachers: [
          { name: "王悦", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819676XLikzy.jpg", course: "「民族声乐」导师", resume: ["抒情花腔女高音", "中国音乐学院民族声乐\n研究生", "多次参加声乐比赛获金奖", "多次指导学生声乐比赛获奖"]},
          { name: "Lily", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644819957bSQSfm.jpg", course: "「声乐技巧」导师", resume: ["高级声乐导师", "台湾第二届“音乐歌剧魅影秋\n之声”亚军", "海峡两岸主持人大赛歌唱才\n艺一等奖"]},
          { name: "苏糖", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820041rQGYkM.jpg", course: "「声乐技巧」导师", resume: ["白俄罗斯国立文化艺术大学\n艺术学硕士", "奥地利莫扎特音乐大学歌剧\n专业", "合唱指挥美声双专业", "中国音乐学院学习民族唱法"]},
          { name: "冯晓晓", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820133bBpFQX.jpg", course: "「朗诵技巧」导师", resume: ["氧气艺术空间创始人", "苏州大学和台湾世新大学\n主持人专业", "上海新民晚报特聘主持人\n老师", "获国家广播主持人资格证", "上海广播电视台主持人"]},
        ]
      },
      {
        category: "艺术类课程导师",
        teachers: [
          { name: "胡伟立", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820276faeOnu.jpg", course: "「文化气质」导师", resume: ["海派作家", "资深文化观察者", "《沪申故事》主笔", "花样百姓特约顾问"]},
          { name: "李妍", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820417JHwLed.jpg", course: "「艺术绘画」导师", resume: ["中央美术学院", "《书中有书》等作品收录中\n央美术学院出版丛书", "参上海没顶艺术中心热浪展", "参国际威尼斯双年展中国馆 "]},
          { name: "王艾文", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820528wwvnFF.jpg", course: "「艺术绘画」导师", resume: ["获艺术导师资格证", "策划并撰写女性艺术家专栏", "策划《带你看展系列活动》\n《艺术与茶》等艺术项目", "实验画室艺术修养课主讲人\n以及留学作品集指导"]},
          { name: "林晓真", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820845OoNeiH.jpg", course: "「中国花道」导师", resume: ["中国林派花道创始人", "中国花道传承协会理事长", "茶道美学十六行法创始人", "中国首本花道心境书籍\n《挽花心境》作者", "浙江农林大学艺术学院导师"]},
          { name: "葛晓慧", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644820941XdNclP.jpg", course: "「拍照姿势」导师", resume: ["中国十大名模", "7年职业礼仪形象讲师", "中国新面孔模特大赛冠军", "ACI国家注册国际礼仪培训师", "中国形象设计师协会导师"]},
          { name: "杨波", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644821031YmJQEe.jpg", course: "「红酒品鉴」导师", resume: ["前红酒客WineKee CEO", "畅酒窖 ChangCellar总经理", "英国WEST L3高级品酒师"]},
          { name: "杨子", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644821296fAohYj.jpg", course: "「茶道知识」导师", resume: ["国家级高级茶艺师考评师", "美国瑜伽联盟认证导师", "素简茶舍创始人", "北京茶业协会副会长", "北京茶文化研究院副主任"]},
          { name: "杨淑娜", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644821428scXwPk.jpg", course: "「茶道养生」导师", resume: ["美籍华裔瑜伽导师", "国家一级茶艺师", "国家一级评茶师", "高级制茶师"]},
        ]
      },
      {
        category: "生活类课程导师",
        teachers: [
          { name: "王建硕", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644821536qsjcuy.jpg", course: "「智能家居」导师", resume: ["百姓网创始人", "著名IT评论者", "专栏作家"]},
          { name: "傅志超", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644821603XGHSoe.jpg", course: "「智能手机」导师", resume: ["前花样百姓IT技术专家", "手机狂热爱好者", "丰富手机教学经验"]},
          { name: "王芳", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644824502FZdzRG.jpg", course: "「肠脑保健」导师", resume: ["HSP大脑教育中国区高级\n培训师", "美国大脑教育领导力培训师", "美国大脑教育高级能量管理\n培训师"]},
          { name: "王梦捷", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644824595DkARSK.jpg", course: "「急救知识」导师", resume: ["美国心脏协会拯救心脏导师", "“救是你”急救推广公益组织\n发起人"]},
          { name: "岑琳", avatar: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1644824741skjEFt.jpg", course: "「国学文化」导师", resume: ["国学导师", "资深传统文化研习者", "瀚禧传统文化研究创办人"]},
        ]
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getTeacherList().then(res=>{
      console.log(res)
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
    bxPoint("huayang_teacher_page", {})
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
    return {
      title: "花样明星师资介绍",
      imageUrl: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1649229494uRlVgh.jpg",
      path: "/statics/teacherTeam/teacherTeam"
    }
  }
})
