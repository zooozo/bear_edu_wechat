const app=getApp()
Page({
    data: {
        trainerImg:null
    },
    onLoad: function (options) {

    },
    chooseLocalImage(){
        wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:(res)=>{
                this.setData({
                    trainerImg:res.tempFilePaths
                })
            }
        })
    },
    deleteImage(){
      this.setData({
          trainerImg:null
      })
    },
    nextStep(){
        if(!this.data.uploadImage){
            wx.showModal({
                title:'提示',
                content:'请上传本人的一张运动类图片'
            })
        }else{
            app.globalData.params.trainerImg=this.data.trainerImg
            wx.navigateTo({
                url:'../step-two/step-two'
            })
        }

    }
});