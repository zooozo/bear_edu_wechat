var http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    url:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconList:['../../images/icon/hui.png','../../images/icon/hui.png','../../images/icon/hui.png','../../images/icon/hui.png','../../images/icon/hui.png',]

  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    //console.log(this.data.item);
  },
  ready() {
    // 星星数组重置一下
    let arr=this.data.iconList;
    let score=this.data.item.stadiumScore.toString().split('.');

    if(score.length>1){
      let num=Number(score[0])
      for(let i=0;i<num;i++){
        arr[i]='../../images/icon/yike.png'
      }
      arr[num]='../../images/icon/ban.png'
    }else{
      for(let i=0;i<this.data.item.stadiumScore;i++){
        arr[i]='../../images/icon/yike.png'
      }
    }
    this.setData({
      iconList:arr
    })
  },
  /**
   * 组件的方法列表
   */
  // wx.makePhoneCall(Object object)
  methods: {
    makePhoneCall(){
      wx.makePhoneCall({
        phoneNumber:this.data.item.stadiumPhone
      })
    }
  }
})