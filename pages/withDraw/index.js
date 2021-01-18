import {clearNoNum, isNumber} from "../../vant/common/utils";

const http = require('../../utils/http')
Page({
      data: {
            myWithDrawPrice: 20,
            entryPrice: null,
            bankList:[],
            chooseIndex:0,
      },
      onLoad: function (options) {
            console.log(options, '=============')
            if (!options.price) {
                  options.price = 20
            } else {
                  this.setData({
                        myWithDrawPrice: options.price
                  })
            }
            this.getBankList();
      },
      bindPickerChange(e){

        this.setData({
              chooseIndex:e.detail.value
        })
      },
      getBankList() {
            http.request({
                  url: '/bankCard/list',
                  method: 'GET',
                  callBack: (res) => {
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
      allWithDraw() {
            this.setData({
                  entryPrice: this.data.myWithDrawPrice
            })
      },
      checkEntryPrice(e) {
            let value = Number(e.detail.value);


            if (!isNumber(value)) {
                  wx.showToast({
                        icon: 'none',
                        title: '请输入正确的数字'
                  })
                  this.setData({
                        entryPrice: ''
                  })
            } else if (value > this.data.myWithDrawPrice) {
                  wx.showToast({
                        title: '提现余额不足',
                        icon: 'none'
                  })
                  this.setData({
                        entryPrice: this.data.myWithDrawPrice
                  })
            } else {
                  console.log(value, 'value----');
                  this.setData({
                        entryPrice: clearNoNum(e.detail.value)
                  })
            }
      },
      withDraw() {
            http.request({
                  url: '/wallet/weChatCashout',
                  data: {
                        moneyNum: this.data.myWithDrawPrice * 100,
                        withdrawType: this.options.type,
                        bankId:this.data.bankList[this.data.chooseIndex].id
                  },
                  callBack: (res) => {
                        console.log(res);
                        if (res.code == 200) {
                              wx.showModal({
                                    content: '提现成功',
                                    success(res) {
                                          wx.navigateTo({
                                                url: '/pages/mybag/account-detail/index'
                                          })
                                    }
                              })
                        } else {
                              wx.showToast({
                                    icon: 'none',
                                    title: res.msg
                              })
                        }
                  }
            })
      }
});