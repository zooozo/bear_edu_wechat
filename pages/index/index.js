//index.js
//获取应用实例
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const app = getApp()

Page({
  data:{
      tabList:[
        {name:'推荐'},
        {name:'羽毛球'},
      ],
      currentIndex:0,
      backgroundList:[
          ['https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
              'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
          ['https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
              'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
      ]
  },
    onShow(){

    },
    getCurrentIndex(e){
      this.setData({
          currentIndex:e.detail
      })
      console.log(e.detail,'index----')
    },
})