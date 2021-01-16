
const http=require('../../utils/http')
var   that={}
Page({
      data: {
            step:1,
            categoryList:[],
            animation:{},
            animationData:{},
            chooseCateId:[],
            animationBtn1:{},
            self:this,
            activeIndex:0,
            multiArray:['','尊敬的用户您好，欢迎使用小熊教育匹配系统，请问您需要如下哪种类型辅导','请选择需要学习什么科目','','']
      },
      onLoad: function (options) {
            this.getCateGoryList();
            that=this;
      },
      chooseCurrentItem(e){
            let current=e.currentTarget.dataset.current
            this.setData({
                  activeIndex:current
            })

      },
      setStep(e){
            let step=e.currentTarget.dataset.step
            let type=e.currentTarget.dataset.type
            let stepNum=Number(type)==1?Number(step)-1:Number(step)+1

            that.setData({
                  step:stepNum,
            })
            if(that.data.step==4){
                  wx.navigateTo({
                        url:'/pages/search-show/search-show?type=1&id='+this.data.chooseCateId[this.data.chooseCateId.length-1]
                  })
                  return
            }
            if(type==1){
                  this.getCateGoryList(this.data.chooseCateId[this.data.step-2])
            }else{
                  that.getCateGoryList(this.data.categoryList[this.data.activeIndex].categoryId)
            }
            let arr=[]
            arr.push(this.data.categoryList[this.data.activeIndex].categoryId)
            this.setData({
                  chooseCateId:[...this.data.chooseCateId,...arr]
            })
            console.log(this.data.step,'step====')



            var animation = wx.createAnimation({
                  duration: 300,
                  timingFunction: "linear",
                  delay: 0
            })



            animation.translateX(600).step()

            setTimeout(function () {
                  // console.log(animation,"init---")
                  // animation.translateX(0).step()
                  //
                  // that.setData({
                  //
                  //
                  //       animationData: animation.export()
                  // })
            }.bind(this), 200)




      },
      getNextCateGory(e){
            let current=e.currentTarget.dataset.current

      },
      getCateGoryList(id){
            http.request({
                  method: 'GET',
                  url:'/category/categoryInfo',
                  data:{
                        parentId: id || 0
                  },
                  callBack:(res)=>{
                        console.log(res,'res---')
                        this.setData({
                              categoryList:res

                        })

                  }

            })
      }
});