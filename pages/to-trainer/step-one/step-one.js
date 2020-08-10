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
                // console.log(res,'res---')
                this.setData({
                    trainerImg:res.tempFilePaths[0]
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
        let that=this;
        if(!this.data.trainerImg){
            wx.showModal({
                title:'提示',
                content:'请上传本人的一张运动类图片'
            })
        }else{
            wx.showLoading({
                title:'上传图片中',
                mask:true
            })
            wx.uploadFile({
                url: "https://dev.weizhukeji.com/badmtn-api/api/file/upload",    //模拟接口
                filePath: that.data.trainerImg,
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                    'Authorization': wx.getStorageSync('token')
                },
                formData: {
                    folderName: 'file'
                },
                success: function (res) {

                    app.globalData.params.trainerImg=res.data
                    wx.navigateTo({
                        url:'../step-two/step-two'
                    })
                },
                fail: (err) => {
                    console.log(err,'err')
                }
            })

        }

    }
});