
const http=require('../../utils/http')
Page({
      data: {
            activeIndex:0,
            categoryList:[
                  {id:0,name:'未使用'},
                  {id:1,name:'已使用'},
            ],
            tabIndex:0,
            couponList:[],
            notUse:[],
            used:[]
      },
      onLoad: function (options) {
            this.getCouponList();
      },
      onChange(e){
            console.log(e,'e=====')
            if(e.detail.index==0){
                  this.setData({
                        couponList:this.data.notUse,
                        tabIndex:e.detail.index,
                  })
            }else{
                  this.setData({
                        couponList:this.data.used,
                        tabIndex:e.detail.index,
                  })
            }

            this.getCouponList();
      },
      toUse(){
        wx.switchTab({
              url:'/pages/index/index'
        })
      },
      getCouponList(){
            http.request({
                  url:"/userCoupon/listUserCoupon",
                  method:'GET',
                  data:{
                        type:this.data.tabIndex
                  },
                  callBack:(res)=>{
                        console.log(res,'res=====')
                        // couponId: 1
                        // couponName: "新人券"
                        // endTime: "2021-01-18"
                        // id: 14
                        // moneyLimit: 2
                        // quota: 2
                        // startTime: "2021-01-16"
                        // useFlag: 0
                        // userId: 27
                        
                        res.forEach((item)=>{
                              item.moneyLimit=parseFloat(item.moneyLimit/100)
                              item.quota=parseFloat(item.quota/100)
                        })
                       this.setData({
                             couponList:res
                       })
                  }
            })
      }
});