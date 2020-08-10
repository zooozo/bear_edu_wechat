const http=require('../../utils/http')

Page({
    data: {
        userData:{
            attentionFlag: false,
            begoodSkill: "扑球、高远球、斜线球、挑球、滑板吊球",
            infoId: null,
            nickName: "Rainie。",
            orderPrice: 200,
            orderTime: (2) ["13", "20"],
            pic: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK49BapO9sOKX6Nk0r0uHoyibkumNZVQVBznERD2zjnXeTsvAz6GVE474MbLgUkQsOoKThOyj0zo6Q/132",
            receivingType: 2,
            skillLevel: 2,
            trainerDescribe: "爱上了对方开具",
            trainerImg: "2020/08/3e3d7fe79f5a472a9e93bcc0b509e5bc.jpg",
            userId: 30,
            weekList: "周一、周二、周三、周五、周六、",
            weekTime: "5,1,2,6,3",
        },
        showData:{
            stadium:null,
            time:null
        },
        activeIndex:1,
        categoryList:[
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六',
            '周日',
        ],//星期列表

        params:{
            stadiumId:null, //场馆id
            channel:1,
            trainerId:30,  //陪练ID
            type:0,
            timeCount:null,
            actualData:null,//预定日期
            timeQuantum:null //预定时间段
        },
        showTimeModal:true,
    },
    onLoad: function (options) {
        console.log(options,'option----')
        this.setData({
            'showData.stadium':options.name,
            'params.stadiumId':options.id
        })
       //  const eventChannel = this.getOpenerEventChannel()
       //  eventChannel.on('postUserData',(res)=>{
       //
       // })
    },
    onShow(){
        this.getPayOrderQuanTime()
    },
    // 获取可以下单的时间列表
    getPayOrderQuanTime(){
        http.request({
            url:'/trainer/selectTimeQuantum',
            method:'GET',
            data:{
                trainerId:8
            },
            callBack(){

            }
        })
    },
    selectStadium(){
        wx.navigateTo({
            url:'./choose-stadium/stadium'
        })
    },
    closeModal(){
        // 点击确定关闭
    },
    closeModal1(){
        // 点击XX按钮
        this.setData({
            showTimeModal:false,
        })
    }
});