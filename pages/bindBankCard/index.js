//index.js
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const config = require('../../utils/config.js')
const app = getApp();
Page({
      data: {
            typeList: {
                  showChaneName: false
            },
            query: {
            },
      },
      onLoad: function (options) {

      },
      onShow(options) {

      },
      getChangeValuse(e) {
            let key = e.currentTarget.dataset.item
            this.setData({
                  [`query.${key}`]: e.detail.value
            })

      },
      submitFormData() {

            // ^(([0-9]{15})|([0-9]{18})|([0-9]{17}x))$
            //     /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
            console.log(this.data.query, 'query,')
            let reg = /^1[3456789]d{9}$/
            if (!this.data.query.bankName) {
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "请输入银行名称"
                  })
            } else if (!this.data.query.bankBranch) {
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "请输入支行名称"
                  })
            } else if (!reg.test(this.data.query.bankUserName)) {
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "请输入开户行姓名"
                  })
            } else if (!this.data.query.bankCardNo) {
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "请输入银行卡号"
                  })
            } else if (!this.data.query.bankMobile) {
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "请输入开卡预留手机号"
                  })
            }else if(!reg.test(this.data.query.bankMobile)){
                  wx.showModal({
                        title: '提示',
                        showCancel:false,
                        content: "手机号格式不正确"
                  })
            } else{
               
                  http.request({
                        url:'/bankCard/createBankCard',
                        method:'POST',
                        data:this.data.query,
                        callBack:(data)=>{
                              wx.showModal({
                                    title: '提示',
                                    content: "绑定成功",
                                    success(res) {
                                          wx.navigateBack()
                                    }
                              })

                        }
                  })
            }

      }

})
