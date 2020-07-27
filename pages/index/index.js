//index.js
//获取应用实例
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const app = getApp()

Page({
    data: {
        tabList: [
            {name: '推荐'},
            {name: '羽毛球'},
        ],
        matchList: [1, 1, 1],
        ImageList: [1, 1, 1, 1, 1, 11, 1, 1, 1, 1],
        imgList: [1, 1, 1],
        currentIndex: 0,
        backgroundList: [
            ['https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
                'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
            ['https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'],
        ]
    },
    onLoad(){


        this.getFavirateList();
    },


    // 获取子组件的Index
    getCurrentIndex(e) {
        this.setData({
            currentIndex: e.detail
        })

    },
    // https://badmtn.weizhukeji.com/badmtn-apip/index/index
    // https://badmtn.weizhukeji.com/badmtn-api/index/index
    getFavirateList() {

        console.log("3333")
        let params = {
            url: '/index/index',
            method: "POST",
            data: {
                nickName:'坦诚',
                userNumber:123456
            },
            callBack:res=>{
                console.log(res,'res---')
            }
        }
        http.request(params);
    },
    toSearchPage: function () {
        wx.navigateTo({
            url: '/pages/search-page/search-page',
        })
    },
})