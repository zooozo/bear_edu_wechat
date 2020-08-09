//index.js
const util = require('../../utils/util.js')
const app=getApp();
Page({
    data: {
        typeList: {
            showChaneName: false
        },
        listShowData: {
            userName: '',
            age:''
        }
    },
    onLoad: function () {
        let that = this;
        wx.getStorage({
            key: 'changeData',
            success(res) {
                console.log(res, 'res---')
                that.setData({
                    'listShowData.userName': res.data.changeName ,
                    'listShowData.age':res.data.age
                })
            },
            fail(err) {
                that.setData({
                    'listShowData.userName': app.globalData.userInfo.nickName    ,
                    'listShowData.age':18
                })
            }
        });


    },
    tapRowType(e) {
        let type = e.currentTarget.dataset.tapclick
        switch (Number(type)) {
            case 1:
                wx.navigateTo({
                    url: './change-name/index'
                })
                break;
            case 2:
                wx.navigateTo({
                    url: './change-date/index'
                })
                break;
        }
    }
})
