const app=getApp()
Page({
    data: {

    },
    onLoad: function (options) {
        app.globalData.params = {}
    },
    getTrainerName(e){
        app.globalData.params.trainerName=e.detail.value;
    },
    getIdCard(e){
        app.globalData.params.idNumber=e.detail.value;
    },
    nextStep(){
        if(!app.globalData.params.trainerName){
            wx.showModal({
                title:'提示',
                content:'请输入姓名'
            })
        }else if(!app.globalData.params.idNumber){
            wx.showModal({
                title:'提示',
                content:'请输入身份证号'
            })
        }else{
            wx.navigateTo({
                url: './step-one/step-one',
            })
        }
        console.log(app.globalData,'阿里斯顿咖啡机')
    }

});