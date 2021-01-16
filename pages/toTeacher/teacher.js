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
                  sex: '女',
                  name: '',
                  userPhone: '',
                  idCard: '',
                  credentialsImg: '',
                  diplomaImg: '',
                  cardImg: '',
                  headImg: ''

            },
      },
      onLoad: function (options) {
            console.log(app.globalData,'globaldata')
            let obj=this.data.query;
           for(let key in  app.globalData.isTeacher){
                 obj[key]=app.globalData.isTeacher[key];
           }
            
            
            this.setData({
                 query:obj
            })
      },
      onShow(options) {
      },
      chooseSex(e) {
            console.log(e, 'e0000000')

            this.setData({
                  'query.sex': e.currentTarget.dataset.sex
            })
      },

      getChangeValuse(e) {
            let key = e.currentTarget.dataset.item
            this.setData({
                  [`query.${key}`]: e.detail.value
            })

      },
      chooseLocalImage(){

      },
      uploadVideo(e) {
            let key = e.currentTarget.dataset.item
            let that=this;
            wx.chooseImage({
                  count:1,
                  sizeType: ['original', 'compressed'],
                  sourceType: ['album', 'camera'],
                  success:(result)=>{
                        console.log(result,'res---')
                        wx.uploadFile({
                              url: config.domain+"/api/file/upload",    //模拟接口
                              filePath: result.tempFilePaths[0],
                              name: 'file',
                              header: {
                                    'content-type': 'multipart/form-data',
                                    'Authorization': wx.getStorageSync('token')
                              },
                              formData: {
                                    folderName: 'file'
                              },
                              success: function (res) {
                                    console.log(res,'res---')
                                    wx.hideLoading();
                                    that.setData({
                                          [`query.${key}`]: app.globalData.imageHost+res.data
                                    })
                                    console.log(that.data.query,'query-0-----')
                              },
                              fail: (err) => {
                                    console.log(err,'err')
                              }
                        })
                  }
            })


      },
      submitFormData() {

            // ^(([0-9]{15})|([0-9]{18})|([0-9]{17}x))$
            //     /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
            console.log(this.data.query, 'query,')
            let reg = /^(([0-9]{15})|([0-9]{18})|([0-9]{17}x))$/
            if (!this.data.query.name) {
                  wx.showModal({
                        title: '提示',
                        content: "请输入真实姓名"
                  })
            } else if (!this.data.query.userPhone) {
                  wx.showModal({
                        title: '提示',
                        content: "请输入身份证号码"
                  })
            } else if (!reg.test(this.data.query.idCard)) {
                  wx.showModal({
                        title: '提示',
                        content: "请输入正确的身份证号码"
                  })
            } else if (!this.data.query.credentialsImg) {
                  wx.showModal({
                        title: '提示',
                        content: "请上传教师资格证或专业证书"
                  })
            } else if (!this.data.query.diplomaImg) {
                  wx.showModal({
                        title: '提示',
                        content: "请上传学历证书"
                  })
            } else if (!this.data.query.cardImg) {
                  wx.showModal({
                        title: '提示',
                        content: "请上传身份证"
                  })
            } else if (!this.data.query.headImg) {

                  wx.showModal({
                        title: '提示',
                        content: "请上传头像"
                  })
            }else{
                  this.data.query.sex=this.data.query.sex=='男'?0:1
                  http.request({
                        url:'/apply/addTrainer',
                        method:'POST',
                        data:this.data.query,
                        callBack:(data)=>{
                              wx.showToast({
                                    title:'已提交审核',
                                    success(res) {
                                          http.request({
                                                url: '/apply/getisTeacher',
                                                data: {userId:app.globalData.userInfo.userId},
                                                method: 'GET',
                                                callBack: (res) => {
                                                      console.log(res.data, '是否是教师')
                                                      getApp().globalData.isTeacher = res.data;
                                                      wx.switchTab({
                                                            url:'/pages/user/user'
                                                      })
                  
                                                }
                                          })
                                         
                                          
                                    }
                              })
                             
                        }
                  })
            }

      }

})
