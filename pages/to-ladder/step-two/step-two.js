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

    }
});