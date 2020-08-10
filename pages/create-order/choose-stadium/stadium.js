const http=require('../../../utils/http')
const app=getApp()

Page({
    data: {
        params:{
            screeningCond:1,
            pageSize:15,
            pageNum:1
        },
        stadiumList:[],
        stopLoad:false,
        isOne:false,
        isTwo:false
    },
    onLoad: function (options) {
        // app.userAuthSetting().then(res=>{
        //     console.log(res,'res----')
        //    if(res){
        //        let data=Object.assign(this.data.params,res);
        //
        //        this.setData({
        //            params:data
        //        })
        //        this.getStadiumList();
        //    }
        // })
    },
    onShow(options){
        app.userAuthSetting().then(res=>{
            console.log(res,'res----')
            if(res){
                let data=Object.assign(this.data.params,res);

                this.setData({
                    params:data
                })
                this.getStadiumList();
            }
        })
    },
    getStadiumList(){
        wx.showLoading(
            {
                title:'加载中'
            }
        );
        http.request({
            url:'/stadium/getStadiumPages',
            method:'GET',
            data:this.data.params,
            callBack:(res)=>{
                if(res.length<this.data.params.pageSize){
                    this.setData({
                        stopLoad:true
                    })
                }
                this.setData({
                    stadiumList:[...this.data.stadiumList,...res]
                })
                wx.hideLoading();
            }
        })
    },
    onReachBottom(){
        let num=this.data.params.pageNum+1;
        if(!this.data.stopLoad){
            this.setData({
                'params.pageNum':num
            })
            this.getStadiumList()
        }
    },
    // 点击顶部的状态效果
    filterStadium(e){
        let type=e.currentTarget.dataset.creent
        if(this.data.params.screeningCond== Number(type))  return
        switch (Number(type)){
            case 1:
                this.setData({
                    isOne:true,
                    isTwo:false,
                    'params.screeningCond':1,
                    stadiumList:[]
                })
                this.getStadiumList()
                break;
            case 2:
                this.setData({
                    isTwo:true,
                    isOne:false,
                    stadiumList:[],
                    'params.screeningCond':2
                })
                this.getStadiumList()
                break;
            case 3:
                this.setData({
                    isTwo:false,
                    isOne:false,
                })
                wx.navigateTo({
                    url:'../search-stadium/search?stadiumLongitude='+this.data.params.stadiumLongitude+'&stadiumLatitude'+this.data.params.stadiumLatitude
                })
                break;
        }

    },
    tapItem(e){
        let current=e.currentTarget.dataset.current;
        wx.navigateTo({
            url:"/pages/create-order/index?name="+current.stadiumName+'&id='+current.id,

        })
    },
});