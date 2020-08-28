//index.js
const util = require('../../../utils/util.js')

Page({
    data: {
        userName: '',
        type: 1,
        autograph: ''
    },
    onLoad: function (options) {
        this.setData({
            type: options.type
        })
    },
    getNewName(e) {
        if (this.data.type == 1) {
            this.setData({
                userName: e.detail.value
            })
        } else {
            this.setData({
                autograph: e.detail.value
            })
        }

    },
    saveName() {

        let obj = {};
        obj = this.data.type == 1 ? {
            nickName: this.data.userName
        } : {autograph: this.data.autograph}
        if ((!this.data.userName || this.data.userName.length == 0) && this.data.type == 1) {
            wx.showToast({
                title: '请输入要修改的名字',
                icon: 'none'
            })
        } else if ((!this.data.autograph || this.data.autograph.length == 0) && this.data.type == 2) {
            wx.showToast({
                title: '请输入您的个性签名',
                icon: 'none'
            })
        } else {
            console.log(obj,'obj---')
            let that = this
            wx.getStorage({
                key: 'listData',
                success(res) {
                    wx.setStorage({
                        key: 'listData',
                        data: Object.assign(res.data, obj),
                        success(res) {
                            wx.navigateTo({
                                url: '../index'
                            })
                        }
                    })
                }
            })

        }
    }

})
