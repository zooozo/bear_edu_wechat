//index.js
const util = require('../../../utils/util.js')

Page({
  data: {
    userName:''
  },
  onLoad: function () {

  },
    getNewName(e){
     this.setData({
         userName:e.detail.value
     })
    },
    saveName(){
      if(!this.data.userName || this.data.userName.length==0){
          this.showModal({
              title:'提示',
              content:'请输入要修改的名字',
              showCancel:false,
          })
      }else{
          wx.setStorage({
              key:'changeData',
              data:{
                  changeName:this.data.userName
              },
              success(res) {
                  wx.navigateTo({
                      url:'../index'
                  })
              }
          })
      }
    }

})
