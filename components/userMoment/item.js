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
    imageList: [],
    className:'',
    ossType:'',
    videoUrl:null
  },
  ready(){
    let arr=this.data.item.momentsImgUrl.split(",");
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
      this.setData({
        imageList:arr,
        videoUrl:vedio,
        className:arr.length<3?'imgType2':'imgType1',
        ossType:ossType
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
           attentionFlag:1
         },
         callBack:(res)=>{
           wx.showToast({
             title:'关注成功'
           })
         }
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
  }
})