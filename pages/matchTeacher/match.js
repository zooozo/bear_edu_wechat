
const http=require('../../utils/http')

Page({
      data: {
            step:1,
            categoryList:[],
            multiArray:['','尊敬的用户您好，欢迎使用小熊教育匹配系统，请问您需要如下哪种类型辅导','','']
      },
      onLoad: function (options) {
            this.getCateGoryList();

      },
      setStep(e){
            let step=e.currentTarget.dataset.step
            this.setData({
                  step:step
            })
      },
      getNextCateGory(e){
            let current=e.currentTarget.dataset.current
            this.getCateGoryList(current.categoryId)
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