//index.js
const util = require('../../utils/util.js')
const http=require('../../utils/http')
Page({
  data: {
    activeIndex:0,
    tabList:[{title:'关注', id:1,fans:2000},{title:'粉丝', id:2,fans:1000},],
    checked:false,
    fansList:[]
  },
  onLoad: function () {
    this.getFansList();
  },
  getFansList(){
    http.request({
      url:'/attention/pageUserAttentionPages',
      method:'GET',
      data:{
        pageSize:20,
        pageNum:1,
        requestType:1
      },
      callBack:(res)=>{
        this.setData({
          fansList:res.records
        })
      }
    })
  },
  onChangeSwitch(e){
    console.log(e,'e0000')
    this.setData({
      checked:!this.data.checked
    })
  }
})
