const app=getApp()
Page({
    data: {
        userName:'',
        userIdCard:''
    },
    onLoad: function (options) {

    },
    getTrainerName(e){

        this.setData({
            userName:e.detail.value
        })
    },
    getIdCard(e){
        this.setData({
            userIdCard:e.detail.value
        })

    },
    nextStep(){

        // ^(([0-9]{15})|([0-9]{18})|([0-9]{17}x))$
        //     /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
            let reg=/^(([0-9]{15})|([0-9]{18})|([0-9]{17}x))$/
            if(!this.data.userName){
                wx.showModal({
                    title:'提示',
                    content:"请输入正确的身份证号码"
                })
            }else if(!this.data.userIdCard){
                wx.showModal({
                    title:'提示',
                    content:"请输入身份证号码"
                })
            }else if(!reg.test(this.data.userIdCard)){
                wx.showModal({
                    title:'提示',
                    content:"请输入正确的身份证号码"
                })
            }else{
                app.globalData.params.trainerName=this.data.userName;
                app.globalData.params.idNumber=this.data.userIdCard;
                wx.navigateTo({
                    url: './step-one/step-one',
                })
            }

    }

});