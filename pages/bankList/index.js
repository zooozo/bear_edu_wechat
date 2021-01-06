const http = require('../../utils/http')

Page({
      data: {
            bankList: []
      },
      onLoad: function (options) {

      },
      onShow() {
            this.getMyBankList();
      },
      getMyBankList() {
            wx.showLoading();
            http.request({
                  url: '/bankCard/list',
                  method: 'GET',
                  callBack: (res) => {
                        console.log(res, 'res---')
                        if (res.length > 0) {
                              res.forEach((item) => {
                                    item.bankCardNo = item.bankCardNo.substring(0, 4) + '******' + item.bankCardNo.substring(item.bankCardNo.length - 3)
                              })

                              this.setData({
                                    bankList: res
                              })
                        }

                  }
            })
      },

      addBank(e) {

            wx.navigateTo({
                  url: '/pages/bindBankCard/index'
            })
      }
});