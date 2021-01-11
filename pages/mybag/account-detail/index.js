const http=require('../../../utils/http')
const app=getApp();

Page({
    data: {
        params:{
            requestType:1,
            pageSize:10,
            pageNum:1,
            trainerId:app.globalData.userInfo.userId || 2
        },
        showMonth:null,
        IsShow:false,
        listData:{},
        recordList:[],
        stopLoad:false,

    },
    onLoad: function (options) {
        console.log(options,'0000000000000');
        if(!options){
            options.type=1;
        }
        this.getAccountRecords();
    },
    getAccountRecords(){
        http.request({
            url:'/trainerWalletRecord/trainerWalletRecordPages',
            method:'GET',
            data:this.data.params,
            callBack:(res)=>{
               if(res.code==200){

                  res.data.trainerWalletRecordList.forEach((item,index)=>{
                      item.amount=parseFloat(item.amount/100).toFixed(2)
                  })
                   res.data.income=parseFloat( res.data.income/100).toFixed(2)
                   res.data.disbursement=parseFloat( res.data.disbursement/100).toFixed(2)

                    let bool=this.data.params.requestType==3?res.data.trainerWalletRecordList.length<this.data.params.pageNum:true
                   this.setData({
                       listData:res.data,
                       recordList:[...this.data.recordList,...res.data.trainerWalletRecordList],
                       stopLoad:bool
                   })
               }
            }
        })
    },
    showBlock(){
      this.setData({
          IsShow:true
      })
    },
    chooseMonth(e){
        let type=e.currentTarget.dataset.month;
        let msg=type==1?'近一个月':type==2?'近三个月':type==3?'所有':null;
        console.log(type,this.data.params.requestType)
        if(type!=this.data.params.requestType){
            this.setData({
                'params.requestType':Number(type),
                showMonth:msg,
                IsShow:false,
                recordList:[]
            })
            this.getAccountRecords();
        }else{
            this.setData({
                IsShow:false
            })
        }
    },
    toWithDraw(){
        wx.navigateTo({
            url:'/pages/withDraw/index?price='+this.data.listData.amount+'&type='+this.options.type
        })
    },
    onReachBottom(){
       if(this.data.params.requestType==3 && !this.data.stopLoad){
           this.data.params.pageNum++
           this.getAccountRecords();
       }
    },

});