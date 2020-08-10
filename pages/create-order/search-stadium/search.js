
const http=require('../../../utils/http')

Page({
    data: {
        params: {
            pageSize:20,
            pageNum:1,
            screeningCond:0
        },
        stadiumList:[],
        seachName:'',
        IsSearch:false
    },
    onLoad: function (options) {
        console.log(options, 'options')
        // this.setData({
        //     params: Object.assign(this.data.params, options)
        // })
        if (options.stadiumLatitude) {
            this.setData({
                params: Object.assign(this.data.params, options)
            })
        } else {
            this.setData({
                'params.stadiumLatitude': 28.22778,
                'params.stadiumLongitude': 112.93886
            })
        }
        // stadiumLatitude: 28.22778
        // stadiumLongitude: 112.93886
    },
    searchStadium(e) {
        http.request({
            url:'/stadium/getStadiumPages',
            method:'GET',
            data:this.data.params,
            callBack:(res)=>{
               this.setData({
                   stadiumList:res
               })
            }
        })
    },
    getStadiumName(e) {
        if (e.detail.value) {
            this.setData({
                'params.stadiumName': e.detail.value,
                IsSearch:true
            })
        }
    },
    clearList(){
       this.setData({
           stadiumList:[],
           seachName:'',
           IsSearch:false
       })
    },
    GoToPage(){
        wx.navigateBack()
    },
    tapItem(e){
        let current=e.currentTarget.dataset.current;
        wx.navigateTo({
            url:"/pages/create-order/index?name="+current.stadiumName+'&id='+current.id,

        })
    },
});