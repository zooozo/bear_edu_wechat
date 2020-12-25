const http=require('../../utils/http')

Page({
      data: {
            query:{}
      },
      onLoad: function (options) {

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

            if (!this.data.query.name) {
                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请输入昵称"
                  })
            } else if (!this.data.query.age) {
                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请输入您的年龄"
                  })
            } else if (!this.data.query.teachAge) {
                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请输入您的教龄"
                  })
            } else if (!this.data.query.advantage) {
                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请展现您的个人优势"
                  })
            } else if (!this.data.query.undergraduate) {
                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请聊聊您的本科经历"
                  })
            }  else if (!this.data.query.other) {

                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "聊聊您的其他学业成就"
                  })
            } else if (!this.data.query.working) {

                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请输入您的工作历史"
                  })
            } else if (!this.data.query.introduce) {

                  wx.showModal({
                        showCancel:false,
                        title: '提示',
                        content: "请填入您的自我介绍"
                  })
            }else{
                  http.request({
                        url:'/apply/addResume',
                        method:'POST',
                        data:this.data.query,
                        callBack:(data)=>{
                              wx.showModal({
                                    showCancel:false,
                                    title: '提示',
                                    content: "添加成功",
                                    success(){
                                          wx.switchTab({
                                                url:'/pages/user/user'
                                          })
                                    }
                              })

                        }
                  })
            }

      }
});