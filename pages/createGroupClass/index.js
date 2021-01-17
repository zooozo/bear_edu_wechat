const http=require('../../utils/http')

Page({
      data: {
            query:{
                  courseId:'',
                  courseName:'',
                  classes:1,
                  persons:'',
                  startTime:'',
                  hours:'',
                  price:'',

            },
            dateTime:'',
            hourTime:'',
            showCategoryName:''
      },
      onLoad: function (options) {

      },
      chooseSex(e){
            let num=e.currentTarget.dataset.sex;
            this.setData({
                  'query.classes':num
            })
      },
      getDateTime(e){
        this.setData({
              dateTime:e.detail.value
        })
      },
      getDateTime1(e){
        this.setData({
              hourTime:e.detail.value
        })
      },
      getCurrentData(e){
            let key=e.currentTarget.dataset.type;
            this.setData({
                  [`query.${key}`]: e.detail.value
            })
      },
      getCurrentCategory(data){
            console.log(data,'data---')
            this.setData({
                  showCategoryName:data.detail.showCategoryName,
                  'query.courseId':data.detail.categoryId
            })
      },
      createGroupClass(){
            console.log(this.data.query.courseId)
            if(!this.data.query.courseId){
                  wx.showToast({
                        title:'请选择课程'
                  })
            }else if(!this.data.query.courseName){
                  wx.showToast({
                        title:'请输入团课名称'
                  })
            }else if(!this.data.query.hours){
                  wx.showToast({
                        title:'请输入课程小时数'
                  })
            }else if(!this.data.query.persons){
                  wx.showToast({
                        title:'请输入最低人数'
                  })
            }else if(!this.data.query.price){
                  wx.showToast({
                        title:'请输入课程价格'
                  })
            }else if(!this.data.dateTime){
                  wx.showToast({
                        title:'请选择开课日期'
                  })
            }else if(!this.data.hourTime){
                  wx.showToast({
                        title:'请选择开课时间'
                  })
            }else{
                  this.data.query.price=this.data.query.price*100;
                  this.data.query.startTime=this.data.dateTime+' '+this.data.hourTime+':00'
                  console.log(this.data.query,'query---')
                  http.request({
                        url:'/groupClass/setting',
                        data:this.data.query,
                        methods:'POST',
                        form:1,
                        errCallBack:()=>{
                              this.setData({
                                    'query.price':this.data.query.price/100
                              })
                        },
                        callBack:(res)=>{
                              wx.switchTab({
                                    url:'/pages/user/user',
                                    success(res) {
                                          wx.showToast({
                                                title:'创建成功',
                                                success(res) {
                  
                  
                                                }
                                          })
                                    }
                              })
                              
                        }
                  })
            }
      }

});