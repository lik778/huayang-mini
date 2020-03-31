const wxml = `
<view class="container" >
  <view class="headIconLine">
    <view class=""></view> 
    <view class="desc">
      <text class="descTitle">您的好友 樊悦</text>
      <text class="descBottom">邀您共同赢取花样会员</text>
    </view> 
  </view>
  <view class="inviteSign">
    <text class="inviteSignOne">享明星导师时尚直播课程</text>
    <text class="inviteSignTwo">严选好物折购优惠</text>
    <text class="inviteSignThree">参与专属活动</text>
  </view>
 
</view>
`

const style = {
  container: {
    width: 300,
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  headIconLine: {
    flexDirection:'row',
  },
  descTitle:{
    width:200,
    height:40,
    fontSize:14
  },
  descBottom:{
    width:200,
    height:40,
    fontSize:14
  },
  inviteSign:{
    width:200,
    height:40,
    fontSize:14
  },
  inviteSignOne:{
    width:200,
    height:40,
    fontSize:14
  },
  inviteSignTwo:{
    width:200,
    height:40,
    fontSize:14
  },
  inviteSignThree:{
    width:200,
    height:40,
    fontSize:14
  },

  headIcon:{
    width:40,
    height:40,
    borderRadius:20
  },
}

module.exports = {
  wxml,
  style
}