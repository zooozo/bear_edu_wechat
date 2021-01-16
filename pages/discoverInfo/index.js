
const http=require('../../utils/http')

Page({
      data: {
            detail:{}
      },
      onLoad: function (options) {
            http.request({
                  url:'/discoverInfo/detail',
                  data:{
                        id:options.id
                  },
                  method:'GET',
                  callBack:(result)=>{
                        this.setData({
                              detail:result
                        })
                  }
            })
      }
});