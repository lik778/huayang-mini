// pages/videoSwiper/videoSwiper.js
const urls = [
  {
    rank: 14,
    name: "【1号】 - 拥抱春天 - 月儿",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582774947BSwGWj.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/26abbc6c-17084a8ba8a/26abbc6c-17084a8ba8a.mp4"
  },
  {
    rank: 28,
    name: "【2号】 - 春语 - shaolijun",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582774983hrjIos.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/45ed6284-17084a94be5/45ed6284-17084a94be5.mp4"
  },
  {
    rank: 20,
    name: "【3号】 - 拥抱春天 - 婉.随缘",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775000pTCiPv.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/805e959-17084a98e2a/805e959-17084a98e2a.mp4"
  },
  {
    rank: 14,
    name: "【4号】 - 春暖花开 - 鹰击长空",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775018Pwatxg.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/26bcf9bd-17084a9d561/26bcf9bd-17084a9d561.mp4"
  },
  {
    rank: 6,
    name: "【5号】 - 拥抱春天 - ω蔯呅ｊūńω",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775030IqgDeN.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/16f338d8-17084aa1bba/16f338d8-17084aa1bba.mp4"
  },
  {
    rank: 6,
    name: "【6号】 - 春 - 玉兔",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775042VwqDLs.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2a50f5cf-17084af3cf4/2a50f5cf-17084af3cf4.mp4"
  },
  {
    rank: 35,
    name: "【7号】 - 抗战疫情拥抱春天 - 名珠",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775083wrOgBt.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/15994bf9-17084af896a/15994bf9-17084af896a.mp4"
  },
  {
    rank: 20,
    name: "【8号】 - 回首花样大赛，静待花开春暖！ - x-joan",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775058kgdzgU.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2c1290c7-170850fe4cc/2c1290c7-170850fe4cc.mp4"
  },
  {
    rank: 11,
    name: "【9号】 - 2020年春节在瑞士看雪 - 顺风顺水！",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582781256DmCExH.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2514cc1f-170851ca394/2514cc1f-170851ca394.mp4"
  },
  {
    rank: 9,
    name: "【10号】 - 拥抱春天 - 💅 细雨💦",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775115EXOZkr.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/39e9fa3e-17084b02504/39e9fa3e-17084b02504.mp4"
  },
  {
    rank: 14,
    name: "【11号】 - 拥抱春天 - 冬雪",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775138kORMxY.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/5d325f04-17084b05243/5d325f04-17084b05243.mp4"
  },
  {
    rank: 9,
    name: "【12号】 - 荡漾在春光里 - 笑赏竹风茶韵",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775161MvSyWz.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/a8be362-17084b07aee/a8be362-17084b07aee.mp4"
  },
  {
    rank: 8,
    name: "【13号】 - 拥抱春天 - 孔雀姑娘",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775178wUVliF.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2684f394-17084b0b8af/2684f394-17084b0b8af.mp4"
  },
  {
    rank: 8,
    name: "【14号】 - 拥抱春天 - 阿生",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775194qVDIIG.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/304ca543-17084b11feb/304ca543-17084b11feb.mp4"
  },
  {
    rank: 15,
    name: "【15号】 - 拥抱春天锻炼身体 - 琴",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775213yzEmUF.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/5a120aa1-17086237572/5a120aa1-17086237572.mp4"
  },
  {
    rank: 10,
    name: "【16号】 - 春天的爱 - 王春香",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775232GcZJES.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2f749ea1-17084b2a2d3/2f749ea1-17084b2a2d3.mp4"
  },
  {
    rank: 9,
    name: "【17号】 - 春天来了 - 金色年华",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775252dqJQRV.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/4f280d44-17084b34936/4f280d44-17084b34936.mp4"
  },
  {
    rank: 7,
    name: "【18号】 - 期待春天 - 拂晓的树林",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775272jDtrwQ.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2d51e9a5-17084b3c83b/2d51e9a5-17084b3c83b.mp4"
  },
  {
    rank: 12,
    name: "【19号】 - 春的气息 - 顾丽琼",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775303BKzqEC.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/1423b3bc-17084b713b7/1423b3bc-17084b713b7.mp4"
  },
  {
    rank: 9,
    name: "【20号】 - 你笑起来真好看- 开心果",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775324wCwBGa.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/21438a5b-17084b77613/21438a5b-17084b77613.mp4"
  },
  {
    rank: 9,
    name: "【21号】 - 生命之光 - 王剑影",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775409xPSXqf.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2660c601-17084b82516/2660c601-17084b82516.mp4"
  },
  {
    rank: 10,
    name: "【22号】 - 拥抱春天 放飞自我 - 佩佩",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582780501Keksbs.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/230e1bd0-1708510ca27/230e1bd0-1708510ca27.mp4"
  },
  {
    rank: 12,
    name: "【23号】 - 春花 - 闲云",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775452cWWfNw.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2774c33c-17084b93a2d/2774c33c-17084b93a2d.mp4"
  },
  {
    rank: 11,
    name: "【24号】 - 春天来了 - 沂蒙山",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775475xBBYLf.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/57b63c1e-170850f16ba/57b63c1e-170850f16ba.mp4"
  },
  {
    rank: 9,
    name: "【25号】 - 云南丽江，初梦之旅 - 岚岚",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775494pxGZck.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/91f129b-17084ba1b41/91f129b-17084ba1b41.mp4"
  },
  {
    rank: 9,
    name: "【26号】 - 我陪你到老 - 可可",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775513LWVboQ.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/34ca6fb6-17084ba8e3d/34ca6fb6-17084ba8e3d.mp4"
  },
  {
    rank: 18,
    name: "【27号】 - 武汉加油中国加油 - 刘钧",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775535BXrLLH.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/4fa6660c-17084baf697/4fa6660c-17084baf697.mp4"
  },
  {
    rank: 9,
    name: "【28号】 - 春的旋律 - 黄珏",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775554XxQStb.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2e642be2-17084bb69d1/2e642be2-17084bb69d1.mp4"
  },
  {
    rank: 14,
    name: "【29号】 - 拥抱春天的故事 - 玉兔",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582775609jvQyFe.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/3e4603c2-17084bbdb98/3e4603c2-17084bbdb98.mp4"
  },
  {
    rank: 11,
    name: "【30号】 - 海棠花 - 雨荷",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582780721qiPLoZ.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/49f2f25f-17085147e87/49f2f25f-17085147e87.mp4"
  },
  {
    rank: 12,
    name: "【31号】 - 疫后带着家人去看草原 - 陶陶",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582780968OOUVRy.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2c8a6d5a-17085176482/2c8a6d5a-17085176482.mp4"
  },
  {
    rank: 11,
    name: "【32号】 - 心意手作 - LILI",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582781019occMdu.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/1afd6032-1708517c4d6/1afd6032-1708517c4d6.mp4"
  },
  {
    rank: 9,
    name: "【33号】 - 冰雪融化，春回大地 - 欢乐舞姐",
    pic: "https://huayang-img.oss-cn-shanghai.aliyuncs.com/1582781039MPkCYb.jpg" + "?x-oss-process=style/huayang-middle",
    url: "https://outin-06348533aecb11e9b1eb00163e1a65b6.oss-cn-shanghai.aliyuncs.com/sv/2fca8ee8-17085185ccb/2fca8ee8-17085185ccb.mp4"
  }
]

const videoList = urls.map(item => ({ id: item.rank, url: item.url }))
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPlay(e) { },

  onPause(e) {
    //  console.log('pause', e.detail.activeId)
  },

  onEnded(e) { },

  onError(e) { },

  onWaiting(e) { },

  onTimeUpdate(e) { },

  onProgress(e) { },

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  }
})