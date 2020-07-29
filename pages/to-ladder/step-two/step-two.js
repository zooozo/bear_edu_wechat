Page({
    data: {
        imageList: []
    },
    onLoad: function (options) {

    },
    chooseLocalImage() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                this.setData({
                    imageList: [...this.data.imageList, ...res.tempFilePaths]
                })
                if (this.data.imageList.length > 9) {
                    wx.showModal({
                        title: '提示',
                        content: '最多上传9张图片'
                    })
                    this.setData({
                        imageList: this.data.imageList.slice(0, 9)
                    })
                }
            }
        })
    },
    deleteImage(e){
        console.log(e,'eee')
        let index=e.currentTarget.dataset.idx
        let arr=this.data.imageList;
        arr.splice(index,1)
        this.setData({
            imageList: arr
        })

    },


nextStep(){
    // "uploadFile:fail Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: Host: badmtn.weizhukeji.com. is not in the cert's altnames: DNS:dev.weizhukeji.com"
        this.data.imageList.forEach((item)=>{
            wx.uploadFile({
                url: "https://badmtn.weizhukeji.com/badmtn-api/api/file/upload",    //模拟接口
                filePath: item,
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                    'Authorization':  wx.getStorageSync('token')
                },
                formData: {
                    folderName: 'file'
                },
                success: function(res){
                    console.log(res,'res====')

                },fail:(err)=>{
                    console.log(err,'err---')
                }
            })
        })
    }
});