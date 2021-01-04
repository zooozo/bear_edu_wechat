const http = require('../../utils/http')

Page({
      data: {
            query: {},
            currentNumber: 0,
            showCategoryName: '',
            showPicker: false,

            multiArray: [[], [], []],
      },
      onLoad: function (options) {
            http.request({
                  method: 'GET',
                  url: '/category/categoryInfo',
                  data: {
                        parentId: 0
                  },
                  callBack: (res) => {
                        res.splice(0, 1)
                        let arr = this.data.multiArray;
                        arr[0] = res

                        this.setData({
                              multiArray: arr
                        }, () => {


                              this.getCategoryList(this.data.multiArray[0][0].categoryId, 1)
                           
                              // this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)
                             


                        })
                  }

            })
            // this.getCategoryList(0, 0)

      },
      getCategoryList(id, index) {
            http.request({
                  method: 'GET',
                  url: '/category/categoryInfo',
                  data: {
                        parentId: id
                  },
                  callBack: (res) => {
                        let arr = this.data.multiArray;
                        arr[index] = res

                        this.setData({
                              multiArray: arr
                        }, () => {
                              console.log(this.data.multiArray,'multiarray')
                              if(this.data.multiArray[2].length>0) return
                              this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)
                        })
                  }

            })

      },
      chooseCategory() {
            console.log("chooseCategory")
            this.setData({
                  showPicker: true
            })
      },
      bindchangeValue(e) {
            console.log(e, '拉克打飞机')
            let selectArr = e.detail.value;
            if(!selectArr[2]){
                 selectArr[2]=0;
            }
            let first = this.data.multiArray[0][selectArr[0]]
            let second = this.data.multiArray[1][selectArr[1]]
            let three = this.data.multiArray[2][selectArr[2]]
            console.log(this.data.multiArray[0][selectArr[0]], this.data.multiArray[1][selectArr[1]], this.data.multiArray[2][selectArr[2]])
            let str = first.categoryName + "-" + second.categoryName + '-' + three.categoryName
            this.setData({
                  showCategoryName: str,
                  'query.yeCategoryId': first.categoryId,
                  "query.parentId":second.categoryId,
                  "query.CategoryId":three.categoryId,
            })


      },
      pickerChange(e) {

            let column = e.detail.column
            console.log(column, 'column----')
            let value = e.detail.value

            if (column >= 2) return
            if (column == 0) {
                  this.getCategoryList(this.data.multiArray[0][value].categoryId, 1)
                  this.getCategoryList(this.data.multiArray[1][value].categoryId, 2)
            } else {
                  this.getCategoryList(this.data.multiArray[1][value].categoryId, 2)
            }

            console.log(this.data.multiArray[column][value], 'e---')
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
                        showCancel: false,
                        title: '提示',
                        content: "请输入昵称"
                  })
            } else if (!this.data.query.age) {
                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请输入您的年龄"
                  })
            } else if (!this.data.query.teachAge) {
                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请输入您的教龄"
                  })
            } else if (!this.data.query.advantage) {
                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请展现您的个人优势"
                  })
            } else if (!this.data.query.undergraduate) {
                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请聊聊您的本科经历"
                  })
            } else if (!this.data.query.other) {

                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "聊聊您的其他学业成就"
                  })
            } else if (!this.data.query.working) {

                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请输入您的工作历史"
                  })
            } else if (!this.data.query.introduce) {

                  wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: "请填入您的自我介绍"
                  })
            } else {
                  http.request({
                        url: '/apply/addResume',
                        method: 'POST',
                        data: this.data.query,
                        callBack: (data) => {
                              wx.showModal({
                                    showCancel: false,
                                    title: '提示',
                                    content: "添加成功",
                                    success() {
                                          wx.switchTab({
                                                url: '/pages/user/user'
                                          })
                                    }
                              })

                        }
                  })
            }

      }
});