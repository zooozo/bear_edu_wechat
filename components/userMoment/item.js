var http = require('../../utils/http.js');
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,

  },

  /**
   * 组件的初始数据
   */
  data: {
    ossUrl:app.globalData.imageHost,
    imageList: [],
    className:'',
    ossType:'',
    videoUrl:null,
    myUserId:''
  },
  ready(){
    let arr=this.data.item.momentsImgUrl.split(",");
    // console.log(this.data.item.momentsImgUrl,'ir;==')
    // 防止切割逗号的时候会有一个空的元素
    let vedio='';
     arr.forEach((item,index)=>{
       if(!item || item.length==0){
          arr.splice(index,1)
       }
       if(item.indexOf('mp4')>0){
         vedio=item;
       }
     })
      let ossType=arr.length<3?'?x-oss-process=image/resize,m_fill,w_112,h_112,limit_0':'?x-oss-process=image/resize,m_fill,w_170,h_170,limit_0'
    console.log(arr,'arr--')
      this.setData({
        imageList:arr,
        videoUrl:vedio,
        className:arr.length<3?'imgType2':'imgType1',
        ossType:ossType,
        myUserId:app.globalData.userInfo.userId
      })
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    //console.log(this.data.item);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clickLike(){

       http.request({
         url:'/attention/saveUserAttention',
         data:{
           beAttentionUid:this.data.item.userId,
           attentionFlag:Number(!this.data.item.delFlag)
         },
         callBack:(res)=>{
           this.setData({
             'item.delFlag':Number(!this.data.item.delFlag)
           })
           wx.showToast({
             title:this.data.item.delFlag==1?'关注成功':'取消关注成功'
           })
         }
       })
    },
    goToDetail(){
      wx.navigateTo({
        url:'/pages/moment-time/detail/detail?id='+this.data.item.id
      })
    },
    clickThumbs() {

      http.request({
        url: '/userLike/saveUserLike',
        data: {
          momentsId: this.data.item.id,
          beLikeUid: this.data.item.userId,
          likeFlag: 1
        }
      })
    },
    tabAvatar(){
      wx.setStorage({
        key:'user',
        data:this.data.item
      })
     let page= getCurrentPages();
      console.log(page[page.length-1].route,'gea----');
      if(page[page.length-1].route!= 'pages/personal-space/index'){
        wx.navigateTo({
          url:'/pages/personal-space/index?userId='+this.data.item.userId
        })
      }
    }
  }
})