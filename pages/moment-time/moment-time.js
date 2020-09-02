// var poly=require('../../utils/ossPolicy')
var http = require("../../utils/http.js");
const app=getApp();
Page({
    data: {
        imageList: [],
        InputText: '',
        params:{}
    },
    onLoad: function (options) {
    },
    chooseLocalImage() {
        wx.chooseMedia({
            count: 9,
            maxDuration:20,
            success: (res) => {
                console.log(res,'res------')
                if(res.type=='video'){
                    this.setData({
                        videoUrl:res.tempFiles[0].tempFilePath
                    })

                }else{
                    if(this.data.videoUrl && this.data.videoUrl.length>0){
                        wx.showToast({
                            title: '不能同时发表视频和图片'
                        })
                        return;
                    }
                    this.setData({
                        imageList: [...this.data.imageList, ...res.tempFiles]
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

            },
            fail:(err)=>{
                console.log(err,'err')
            }
        })
    },

    deleteImage(e) {
        let arr = this.data.upLoadList;
        arr.splice(e.detail.index, 1)
        this.setData({
            imageList: arr
        })
    },
    userAuthSetting(){
        let that=this;
        return new Promise((re,rj)=>{
            wx.getSetting({
                success(res) {
                    // 如果是还未授权的就弹出授权
                    if (res.authSetting['scope.userLocation'] ==null) {
                        wx.authorize({
                            scope: 'scope.userLocation',
                            success (res) {
                                // 如果之前未获取授权权限
                                wx.getLocation({
                                    type: 'wgs84',
                                    success(res) {

                                        that.setData({
                                            'params.momentsLongitude':res.latitude,
                                            'params.momentsLatitude':res.longitude
                                        });
                                        re(true)
                                    },
                                    fail:()=>{
                                        rj(false)
                                    }
                                })
                            }
                        })
                    }else if(res.authSetting['scope.userLocation']===false){
                        // 如果是弹出了授权然后用户点击了拒绝
                        wx.showModal({
                            title: '提示',
                            content: '请在设置中允许获取您的地理位置',
                            success:(res)=>{
                                // 打开设置让用户打开位置权限
                                wx.openSetting({
                                    success (res) {
                                        console.log(res.authSetting)
                                        if(res.authSetting['scope.userLocation]']){
                                            wx.getLocation({
                                                type: 'wgs84',
                                                success(res) {

                                                    that.setData({
                                                        'params.momentsLongitude':res.latitude,
                                                        'params.momentsLatitude':res.longitude
                                                    });
                                                    re(true)
                                                },
                                                fail:()=>{
                                                    rj(false)
                                                }
                                            })
                                        }

                                        // res.authSetting = {
                                        //   "scope.userInfo": true,
                                        //   "scope.userLocation": true
                                        // }
                                    }
                                })
                            }
                        })

                    }else{
                        wx.getLocation({
                            type: 'wgs84',
                            success(res) {

                                that.setData({
                                    'params.momentsLongitude':res.latitude,
                                    'params.momentsLatitude':res.longitude
                                });
                                re(true)
                            },
                            fail:()=>{
                                rj(false)
                            }
                        })
                    }
                }
            })
        })

    },

    postMomentTime() {
        if (!this.data.InputText.length> 0) {
            wx.showModal({
                title: '提示',
                content: '请输入要发表的动态',showCancel:false,
            })

        } else if (!this.data.imageList.length || this.data.imageList.length == 0 ) {

            wx.showModal({
                title: '提示',
                content: '请上传一张图片或者一段视频',
                showCancel:false,
            })
        } else {
            this.setData({
                'params.momentsContent':this.data.InputText
            })
            let that=this, str='',num;
            this.userAuthSetting().then(res=>{
                if(res){
                    wx.showLoading({
                        title:'发布动态中',
                        mask:true
                    })
                    // 先判断是否是上传了视频还是图片

                    if(this.data.videoUrl &&this.data.videoUrl.length>0){
                        wx.uploadFile({
                            url: "https://dev.weizhukeji.com/badmtn-api/api/file/upload",    //模拟接口
                            filePath: this.data.videoUrl,
                            name: 'file',
                            header: {
                                'content-type': 'multipart/form-data',
                                'Authorization': wx.getStorageSync('token')
                            },
                            formData: {
                                folderName: 'file'
                            },
                            success: function (res) {
                                console.log(res,'视频上传')
                                that.setData({
                                    'params.momentsImgUrl':res.data
                                })
                                http.request({
                                    url:'/moments/savePublishMoments',
                                    data:that.data.params,
                                    callBack:(data)=>{
                                        wx.hideLoading();
                                        that.upLoadAfter(data)
                                    }
                                })
                            }, fail: (err) => {
                                console.log(err, 'err---')
                                wx.hideLoading()
                            }
                        })

                    }
                    else{
                        this.data.imageList.forEach((item,index) => {
                             num=index
                            wx.uploadFile({
                                url: "https://dev.weizhukeji.com/badmtn-api/api/file/upload",    //模拟接口
                                filePath: item.tempFilePath,
                                name: 'file',
                                header: {
                                    'content-type': 'multipart/form-data',
                                    'Authorization': wx.getStorageSync('token')
                                },
                                formData: {
                                    folderName: 'file'
                                },
                                success: function (res) {
                                    //如果是最后一个在set进去
                                    if(index==that.data.imageList.length-1){
                                        that.setData({
                                            'params.momentsImgUrl':res.data
                                        })
                                        http.request({
                                            url:'/moments/savePublishMoments',
                                            data:that.data.params,
                                            callBack:(data)=>{
                                                wx.hideLoading();
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '动态发表成功',
                                                    showCancel:false,
                                                    success:()=>{
                                                        wx.navigateBack()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }, fail: (err) => {
                                    wx.hideLoading()
                                }
                            })
                        })

                    }


                }else{
                    wx.showToast({
                        title:'获取地理位置信息错误'
                    })
                }

            });
        }
    },
    // 动态监听一下输入的内容改变按钮的颜色
    getInputText(e) {
        this.setData({
            InputText: e.detail.value
        })
    }
});