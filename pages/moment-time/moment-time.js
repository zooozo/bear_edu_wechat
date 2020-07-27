
// var poly=require('../../utils/ossPolicy')
Page({
    data: {
        upLoadList:[],
        InputText:'',
    },
    onLoad: function (options) {
        this.getCurrentLocal();
    },

    getCurrentLocal(){
        let that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userLocation'] == false){// 如果已拒绝授权，则打开设置页面
                    wx.openSetting({
                        success(res) {}
                    })
                }  else { // 第一次授权，或者已授权，直接调用相关api
                    that.getMyLocation()
                }
            }
        })
    },
    // 获取当前地理位置
    getMyLocation(){
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                console.log(res)
            }
        })
    },
    getUpLoadImage(e){
        let arr=[];
        e.detail.file.forEach((item)=>{
            arr.push({url:item.tempFilePath})
        })
        console.log(e,'eeeee')
        console.log(arr,'arr---')
        this.setData({
            upLoadList:[...arr,...this.data.upLoadList]
        })
    },
    upLoadImageToOss(filePath){
        const host = 'https://test.weizhukeji.com';
        const signature = '<signatureString>';
        const ossAccessKeyId = 'LTAIklypW1uiMOZl';
        const policy =  'r3DNwh1c4fC9Y8uYULZczdb8sC7yzF';
        const key = 'LTAIklypW1uiMOZl';
        const securityToken = '<x-oss-security-token>';
        wx.uploadFile({
            url: host, // 开发者服务器的URL。
            filePath: filePath,
            name: 'file', // 必须填file。
            formData: {
                key,
                policy,
                OSSAccessKeyId: ossAccessKeyId,
                signature,
                // 'x-oss-security-token': securityToken // 使用STS签名时必传。
            },
            success: (res) => {
                if (res.statusCode === 204) {
                    console.log('上传成功');
                }
            },
            fail: err => {
                console.log(err);
            }
        });
    },
    beforeUpload(e){
        console.log(e,'ee-----')
        let type=e.detail.file.type
        if(type=='file'){
            console.log("111")
            wx.showModal({
                title:'上传失败',
                content:'请上传图片和视频'
            })
            e.detail.callback(false)

        }else{
            console.log("2222")
            e.detail.callback(true)
        }
    },
    deleteImage(e){
        console.log(e,'e000')
        console.log(this.data.upLoadList,'e000')
        let arr=this.data.upLoadList;
        arr.splice(e.detail.index,1)
        this.setData({
            upLoadList:arr
        })
        console.log(this.data.upLoadList,'e000')
    },
    postMomentTime(){
        if(!this.data.upLoadList.length || this.data.upLoadList.length==0 ){
            this.showModal({
                title:'提示',
                content:'请上传一张图片或者一段视频'
            })

        }else if(!this.data.InputText|| this.data.InputText.length==0){
            this.showModal({
                title:'提示',
                content:'请输入要发表的动态'
            })
        }else{

        }
    },
    // 动态监听一下输入的内容改变按钮的颜色
    getInputText(e){
        this.setData({
            InputText:e.detail.value
        })
    }
});