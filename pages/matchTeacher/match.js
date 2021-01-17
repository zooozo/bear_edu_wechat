
const http=require('../../utils/http')
var   that={}
Page({
      data: {
            step:1,
            categoryList:[],
            animationData:{},
            chooseCateId:[],
            animationBtn1:{},
            animation:null,
            self:this,
            activeIndex:0,
            multiArray:['尊敬的用户您好，欢迎使用小熊教育匹配系统，请问您需要如下哪种类型辅导','请选择需要学习什么科目','','']
      },
      onLoad: function (options) {

            that=this;
      },
      onShow(){
        this.setData({
              step:-1,
              categoryList:[],
              chooseCateId:[],
              animation:[],
              activeIndex:0
        })
      },
      chooseCurrentItem(e){
            let current=e.currentTarget.dataset.current
            this.setData({
                  activeIndex:current
            })

      },
      
      stepCount(e){
            let step=e.currentTarget.dataset.step
            let type=e.currentTarget.dataset.type
            let stepNum=Number(type)==1?Number(step)-1:Number(step)+1
            console.log(stepNum,'stepNum-----')
            console.log(this.data.chooseCateId,'------')
            that.setData({
                  step:stepNum,
            })
            this.getCateGoryList(this.data.chooseCateId).then(bool=>{
                  if(bool){
                        if(bool){
                              wx.navigateTo({
                                    url:'/pages/search-show/search-show?type=1&id='+this.data.chooseCateId[this.data.chooseCateId.length-1]
                              })
                             
                        }
                  
                  }
            })
      },
      
      
      setStep(e){
            let step=e.currentTarget.dataset.step
            let type=e.currentTarget.dataset.type
            let stepNum=Number(type)==1?Number(step)-1:Number(step)+1
            console.log(stepNum,'stepNum------')
          
            that.setData({
                  step:stepNum,
            })






            var animation = wx.createAnimation({
                  duration: 300,
                  timingFunction: "linear",
                  delay: 0
            })
            this.animation=animation

            animation.translateX(600).step()
            if(that.data.step>=3){
                  let arr=[]
                  arr.push(this.data.categoryList[this.data.activeIndex].categoryId)
                  this.setData({
                        chooseCateId:[...this.data.chooseCateId,...arr]
                  })
                  wx.navigateTo({
                        url:'/pages/search-show/search-show?type=1&id='+this.data.chooseCateId[this.data.chooseCateId.length-1]
                  })
                  return
            }
            setTimeout( function () {
                  // console.log(animation,"init---")
                  animation.translateX(0).step()
                  if(type==1){
                        console.log(this.data.chooseCateId,'arr000')
                        this.getCateGoryList(this.data.chooseCateId[this.data.step]).then(bool=>{
                              if(bool){
                                    let arr=[]
                                    arr.push(this.data.categoryList[this.data.activeIndex].categoryId)
                                    this.setData({
                                          chooseCateId:[...this.data.chooseCateId,...arr]
                                    })
                                    if(res.length==0){
                                          wx.navigateTo({
                                                url:'/pages/search-show/search-show?type=1&id='+this.data.chooseCateId[this.data.chooseCateId.length-1]
                                          })
                                          return;
                                    }

                              }
                        })
                  }
                  else{
                        let id=this.data.categoryList.length>0 ?this.data.categoryList[this.data.activeIndex].categoryId : 0
                        that.getCateGoryList(id)
                            .then(bool=>{
                                
                                  if(bool){
                                        let arr=[]
                                        arr.push(this.data.categoryList[this.data.activeIndex].categoryId)
                                        this.setData({
                                              chooseCateId:[...this.data.chooseCateId,...arr]
                                        })
                                        wx.navigateTo({
                                              url:'/pages/search-show/search-show?type=1&id='+this.data.chooseCateId[this.data.chooseCateId.length-1]
                                        })
                                        return;
                                  }
                            })
                  }

                  // console.log(this.data.chooseCateId,'step====')
                  that.setData({


                        animationData: animation.export(),

                  },()=>{
                        
                        // 设置完后会执行动画在把把清空一下
                        that.setData({
                              animationData:null,
                              animation:null
                        })
                  })

            }.bind(this), 200)




      },

      getCateGoryList(id){
            return new Promise((re,rj)=>{
                  http.request({
                        method: 'GET',
                        url:'/category/categoryInfo',
                        data:{
                              parentId: id || 0
                        },
                        callBack:(res)=>{
                              console.log(this.data.step,'step=======')
                              let arr=this.data.chooseCateId.pus
                              this.setData({
                                    categoryList:res,
                                    chooseCateId:res[this.data.step].categoryId
                              })
                              re(res.length==0)
                        }

                  })
            })

      }
});