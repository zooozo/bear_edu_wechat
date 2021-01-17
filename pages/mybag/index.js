const http = require('../../utils/http')

Page({
    data: {
        myAccount:{}
    },
    onLoad: function (options) {
        this.getMyAccount();
    },
    getMyAccount() {
        wx.showLoading();
        http.request({
                url: '/wallet/myWallet',
                method: 'GET',
                callBack: (res) => {
                    if(res.code==200){
                        res.data.balanceAccount=parseFloat(res.data.balanceAccount/100).toFixed(2)
                        res.data.totalAccount=parseFloat(res.data.totalAccount/100).toFixed(2)
                        res.data.trainerAccount=parseFloat(res.data.trainerAccount/100).toFixed(2)
                        res.data.trainerCanWithdraw=parseFloat(res.data.trainerCanWithdraw/100).toFixed(2)


                        this.setData({
                            myAccount:res.data
                        })
                    }else{
                        wx.showToast({
                            title:res.msg,
                            icon:'none'
                        })
                    }
                    wx.hideLoading();
                }
            }
        )
    },
    ToDetailPage(e){
        let type=e.currentTarget.dataset.type;
        let price=type==1?this.data.myAccount.balanceAccount:this.data.myAccount.trainerAccount
        wx.navigateTo({
            url:'./account-detail/index?type='+type+'&price='+price
        })
    },
    submitFormData(){
        wx.navigateTo({
            url:'/pages/bankList/index'
        })
    }
});