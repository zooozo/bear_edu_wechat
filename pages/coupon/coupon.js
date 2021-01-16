
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

            // this.getCouponList();
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

                        this.setData({
                              couponList:res.filter((item)=>item.useFlag==1),
                              notUse:res.filter((item)=>item.useFlag==1),
                              used:res.filter((item)=>item.useFlag==0)
                        })
                  }
            })
      }
});