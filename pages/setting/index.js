//index.js
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const app = getApp();
Page({
    data: {
        typeList: {
            showChaneName: false
        },
        listSData: {
            nickName: '',
            userAge: '',
            userStarseat: '',
            pic:'',
            hometown: '',
            autograph: '',
            userInterest: '',
            userOccupation: '',
            userSchool: '',
            userVideo: '',
            userRunImg: null,

        }
    },
    onLoad: function (options) {


        let that = this;
        wx.getStorage({
            key: 'listData',
            success(res) {
                console.log(res);
                that.setData({
                    listData: res.data
                })
            },
            fail(err) {
                console.log(app.globalData.userInfo, '----')
                that.setData({
                    'listData.nickName': app.globalData.userInfo.nickName,
                    'listData.pic': app.globalData.userInfo.pic,
                })
            }
        });




    },
    onShow(options) {

    },
    getAutograph(e) {
        let type = e.currentTarget.dataset.even;
        let typeName;
        if (type == 'home') {
            this.setData({
                'listData.hometown': e.detail.value
            })
            typeName={
                hometown:e.detail.value
            }
        } else if (type == 'school') {
            this.setData({
                'listData.userSchool': e.detail.value
            })
            typeName={
                userSchool:e.detail.value
            }
        } else {
            this.setData({
                'listData.userOccupation': e.detail.value
            })
            typeName={
                userOccupation:e.detail.value
            }
        }

        wx.getStorage({
            key: 'listData',
            success(res) {
                wx.setStorage({
                    key: 'listData',
                    data: Object.assign(res.data, typeName),
                    success(res) {

                    }
                })
            }
        })
    },
    uploadVideo(e) {
        let type = e.currentTarget.dataset.type
        console.log(type);
        app.UploadMedia({media: [type + '']}).then(res => {
            console.log(res, 'res---')
            // duration: 12.515556
            // height: 960
            // size: 1036854
            // tempFilePath: "http://tmp/wxfa5368fa43713400.o6zAJs5euVNCaD2u-G5ff7w80tqc.3dMciMM2mU9U5169f7f0613b504121db98bd9d27a9c4.mp4"
            // thumbTempFilePath: "http://tmp/wxfa5368fa43713400.o6zAJs5euVNCaD2u-G5ff7w80tqc.auR5gec0Zs7ze637a5733a3d71eef842343ce41d1574.jpg"
            // width: 544
            if (type == 'video') {
                this.setData({
                    'listData.userVideo': res.tempFiles[0].tempFilePath
                })
            } else {

                this.setData({
                    'listData.userRunImg': res.tempFiles[0].tempFilePath
                })
            }

        })
    },
    tapRowType(e) {
        let type = e.currentTarget.dataset.tapclick
        switch (Number(type)) {
            case 1:
                wx.navigateTo({
                    url: './change-name/index?type=1'
                })
                break;
            case 2:
                wx.navigateTo({
                    url: './change-date/index'
                })
                break;
            case 3:
                wx.navigateTo({
                    url: './change-name/index?type=3'
                })
                break;
            case 4:
                wx.navigateTo({
                    url: './my-tastes/index'
                })
                break;
        }
    },
    saveMyData() {
        if (!this.data.listData.userAge || !this.data.listData.userStarseat) {
            wx.showToast({
                title: '请选择年龄星座',
                icon: 'none',
            })
        } else if (!this.data.listData.hometown) {
            wx.showToast({
                title: '请选择家乡',
                icon: 'none',
            })
        } else {
            let that=this;

            app.UploadFileToOss(this.data.listData.userRunImg,(res)=>{

                // that.setData({
                //     'listData.userRunImg':res.data
                // })
                that.data.listData.userRunImg=res.data
                if(!this.data.listData.userVideo){
                    http.request({
                        url:'/p/user/setUser',
                        data:this.data.listData,
                        callBack:(res)=>{
                            wx.switchTab({
                                url:'/pages/user/user'
                            })
                        }
                    })
                }else{
                    app.UploadFileToOss(this.data.listData.userVideo, (res) => {
                        that.data.listData.userVideo=res.data;
                        // this.setData({
                        //     'listData.userVideo':res.data
                        // })
                        http.request({
                            url:'/p/user/setUser',
                            data:this.data.listData,
                            callBack:(res)=>{
                                wx.switchTab({
                                    url:'/pages/user/user'
                                })
                            }
                        })
                    })
                }

            })

        }
    },
    onHide() {
        wx.setStorage({
            key: 'listData',
            data: this.data.listData
        })
    }
})
