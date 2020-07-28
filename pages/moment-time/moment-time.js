// var poly=require('../../utils/ossPolicy')
var http = require("../../utils/http.js");
Page({
    data: {
        upLoadList: [],
        InputText: '',
    },
    onLoad: function (options) {
        this.getCurrentLocal();
    },

    getCurrentLocal() {
        let that = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userLocation'] == false) {// 如果已拒绝授权，则打开设置页面
                    wx.openSetting({
                        success(res) {
                        }
                    })
                } else { // 第一次授权，或者已授权，直接调用相关api
                    that.getMyLocation()
                }
            }
        })
    },
    // 获取当前地理位置
    getMyLocation() {
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                console.log(res)
            }
        })
    },
    getUpLoadImage(e) {
        let arr = [];
        console.log(e, 'e----')
        e.detail.file.forEach((item) => {
            arr.push({url: item.tempFilePath})
            this.upLoadImageToOss(item.tempFilePath, item);
        })
        this.setData({
            upLoadList: [...arr, ...this.data.upLoadList]
        })

    },
    upLoadImageToOss(filePath, item) {
        let params = {
            url: '/api/file/upload',
            form: 1,
            method: 'POST',
            data: {
                file:filePath
            },
            callBack: (res) => {
                console.log(res, 'res---')
            }
        }
        http.request(params)
        // wx.uploadFile({
        //     url:'http://eco-culture.oss-cn-shenzhen.aliyuncs.com/',
        //     name:'file',
        //     filePath:filePath,
        //     formData: {
        //         key:'upload',
        //         OSSAccessKeyId: "5F1FC52285D3EB363382281F",
        //
        //         // 'x-oss-security-token': securityToken // 使用STS签名时必传。
        //     },
        //     success:(res)=>{
        //         console.log(res,'阿里斯顿咖啡机')
        //     },
        //     fail:(err)=>{
        //         console.log(err,'err---')
        //     }
        // })

    },
    beforeUpload(e) {
        let type = e.detail.file.type
        if (type == 'file') {
            wx.showModal({
                title: '上传失败',
                content: '请上传图片和视频'
            })
            e.detail.callback(false)
        } else {
            e.detail.callback(true)
        }
    },
    deleteImage(e) {
        let arr = this.data.upLoadList;
        arr.splice(e.detail.index, 1)
        this.setData({
            upLoadList: arr
        })
    },
    postMomentTime() {
        if (!this.data.upLoadList.length || this.data.upLoadList.length == 0) {
            this.showModal({
                title: '提示',
                content: '请上传一张图片或者一段视频'
            })

        } else if (!this.data.InputText || this.data.InputText.length == 0) {
            this.showModal({
                title: '提示',
                content: '请输入要发表的动态'
            })
        } else {

        }
    },
    // 动态监听一下输入的内容改变按钮的颜色
    getInputText(e) {
        this.setData({
            InputText: e.detail.value
        })
    }
});