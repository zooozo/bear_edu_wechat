const app = getApp();
const http=require('../../../utils/http')
Page({
    data: {
        list: [
            {name: '业余一级', text: '刚学羽毛球，不会拿拍，打球总是打不到，对于羽毛球，有兴趣的就打打 ，没有兴趣了，可能一年半载打不了一次！', type: 1},
            {name: '业余二级', text: '对羽毛球刚刚有“瘾”，一旦有“瘾”，这就是一个好现象，最喜欢打直来直去的中场“高远球”，能接住很多拍，稍微耍点技术手段，他就会接不到球！', type: 2},
            {name: '业余三级', text: '开始知道打羽毛球不是为了让对方接住，而是为了不让对方接住，是二级的升级版，不再限于打高球，开始打平抽和杀球！', type: 3}
        ],
        list2: [
            {name: '技能等级', text: '请选择技能等级'},
            {name: '接单时间', text: '请选择时间段'},
            {name: '擅长技能', text: '请选择擅长技能'},
            {name: '接单价格', text: '¥100/1小时'},
        ],
        weekList: [
            // '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六',
            {name: '星期日', id: 7, selected: false},
            {name: '星期一', id: 1, selected: false},
            {name: '星期二', id: 2, selected: false},
            {name: '星期三', id: 3, selected: false},
            {name: '星期四', id: 4, selected: false},
            {name: '星期五', id: 5, selected: false},
            {name: '星期六', id: 6, selected: false},
        ],
        skillList:[
            {name:'平抽球',id:1,selected: false},
            {name:'杀球',id:2,selected: false},
            {name:'高远球',id:3,selected: false},
            {name:'斜线球',id:4,selected: false},
            {name:'吊球',id:5,selected: false},
            {name:'搓球',id:6,selected: false},
            {name:'扑球',id:7,selected: false},
            {name:'挑球',id:8,selected: false},
            {name:'假动作',id:9,selected: false},
            {name:'劈叉',id:10,selected: false},
            {name:'往前勾对角',id:11,selected: false},
            {name:'滑板吊球',id:12,selected: false},


        ],
        hour: [],
        hour2: [],
        currentList2Index:0,
        currentIndex: 0,
        showSkillModal: false,//是否技能等级模块
        showOrderTimeModal: false, //是否显示选择时间模块
        showSkillModalList: false,//是否显示擅长技能


        certainTimesIndex: 1,
        weekItemIndex: 1,
        chooseWeekList: [],
        chooseSkillArr: [],
        chooseHour: '',
        chooseHour1: '',
        pageShowData:{},
        clickCount:0,
    },
    onLoad: function (options) {
        let arr = []
        for (let i = 1; i <= 24; i++) {
            if (i < 10) {
                arr.push('0' + i)
            } else {
                arr.push(i + "")
            }
        }

        this.setData({
            hour: arr,
            hour2: arr
        })

    },
    OnSubmit(){
        // begoodSkill: "扑球,往前勾对角,滑板吊球,挑球,斜线球,"
        // idNumber: "36030219900506353x"
        // orderDate: ""
        // orderPrice: 10000
        // orderTime: ""
        // receivingType: 1
        // skillLevel: 0
        // trainerDescribe: "asdfas"
        // trainerImg: "https://eco-culture.oss-cn-shenzhen.aliyuncs.com/2020/07/25a14b0818504768b24b5ee8dbae52d9.png"
        // trainerName: "谢勋"
        // user_id: 22
        // weekTime: "1,2,3,4,5,6,7"

        if(!app.globalData.params.skillLevel)

        app.globalData.params.orderTime=this.data.chooseHour+","+this.data.chooseHour1
        app.globalData.params.skillLevel = Number(this.data.currentIndex)+1;
        app.globalData.params.receivingType=this.data.certainTimesIndex;
        app.globalData.params.userId=app.globalData.userInfo.userId;
        app.globalData.params.nickName=app.globalData.userInfo.nickName;

            if(!app.globalData.params.skillLevel  && this.data.clickCount<1){
                wx.showModal({
                    title: '提示',
                    content: '请选择技能等级',
                    showCancel:false
                })
                return
            }
            if(!app.globalData.params.receivingType && this.data.clickCount<2){
                wx.showModal({
                    title: '提示',
                    content: '请选择接单时间',
                    showCancel:false
                })
                return
            }
            if(!app.globalData.params.begoodSkill && this.data.clickCount<3){
                wx.showModal({
                    title: '提示',
                    content: '请选择擅长技能 ',
                    showCancel:false
                })
                return
            }
            if(!app.globalData.params.orderPrice){
                wx.showModal({
                    title: '提示',
                    content: '请输入接单价格 ',
                    showCancel:false
                })
                return
            }


        http.request({
            url:'/trainer/addTrainer',
            data:app.globalData.params,
            callBack:(res)=>{
              wx.navigateTo({
                  url:'../step-four/step-four'
              })

            }
        })
    },
    closeModal(e) {
        if (e.currentTarget.dataset.choose == 'chooseSkillLeave') {
            this.setData({
                showSkillModal: false
            })
        }
        else if (e.currentTarget.dataset.choose == 'chooseTime') {
            // 如果当前选择是全部时间段  certainTimesIndex   1：全部   2:按周
            if (this.data.certainTimesIndex == 1) {
                app.globalData.params.orderDate = '';
                app.globalData.params.weekTime = '1,2,3,4,5,6,7';
            }
            else {
                if(!this.data.chooseHour || !this.data.chooseHour1){
                    wx.showModal({
                        title: '提示',
                        content: '请选择接单小时区间 ',
                        showCancel:false
                    })
                    return
                }

                // 今天
                let today = new Date();
                console.log(today)
                // 今天几号
                let DayNumber = today.getDate();
                // 今天星期几
                let week = today.getDay();//获取存储当前日期
                console.log(week)
                this.data.chooseWeekList.sort((item) => {
                    return item['id'] - item['id']
                })
                let  weekStr = ''
                this.data.chooseWeekList.forEach((item) => {
                    weekStr += item.id + ","

                })

                app.globalData.params.weekTime = weekStr.substring(0,weekStr.length-1);


            }

            this.setData({
                showOrderTimeModal: false
            })
        }
        else if(e.currentTarget.dataset.choose=='chooseSkill'){
            // begoodSkill
            if(this.data.chooseSkillArr.length==0){
                wx.showModal({
                    title: '提示',
                    content: '请选择擅长技能 ',
                    showCancel:false
                })
                return
            }
            let str=''
            this.data.chooseSkillArr.forEach((item)=>{
                console.log(item,'item---')
                str+=item.name+',';
            })

            app.globalData.params.begoodSkill=str.substring(0,str.length-1);

            this.setData({
                showSkillModalList: false
            })
        }else{
            let current="list2[" + this.data.currentList2Index + "].text"
            switch (this.data.currentList2Index) {
                case 0:
                    this.setData({
                        showSkillModal: false,
                        [current]:"请选择技能等级"
                    })

                    break;
                case 1:
                    this.setData({
                        showOrderTimeModal: false,
                        [current]:"请选择时间段"
                    })

                    break;
                case 2:
                    this.setData({
                        showSkillModalList: false,
                        chooseSkillArr:[],
                        [current]:"请选择擅长技能"
                    })
                    break;
            }
        }


    },

    showCurrentModal(e) {

        let index = e.currentTarget.dataset.current
        console.log(index, 'index---')
        let num=this.data.clickCount
        num++
        let current="list2[" + index + "].text"
        // 先给一个默认的，这样点完成的时候就不会为空
        switch (index) {
            case 0:

                this.setData({
                    showSkillModal: true,
                    [current]:this.data.list[index].name,
                    clickCount:num,

                })

                break;
            case 1:
                this.setData({
                    showOrderTimeModal: true,
                    [current]:'全部时间段',
                    clickCount:num,

                })

                break;
            case 2:
                this.setData({
                    showSkillModalList: true,
                    [current]:'平抽球',
                    clickCount:num,

                })
                break;
        }
        console.log(this.data.clickCount)
        this.setData({
            currentList2Index: index
        })
    },
    // 获取当前输入的价格
    getOrderPrice(e){
        let num=e.detail.value;

        app.globalData.params.orderPrice=num*10*10
    },
    // 点击时间段事件
    chooseTimeTum(e) {

        let current="list2[" + this.data.currentList2Index + "].text"
        console.log(current,'current---')
        let txt= e.currentTarget.dataset.cur==1?'全部时间段':'按周'
        this.setData({
            certainTimesIndex: e.currentTarget.dataset.cur,
            [current]:txt
        })
    },
    // 选择技能等级
    selectSkill(e) {

        let current="list2[" + this.data.currentList2Index + "].text"
        this.setData({

            currentIndex: e.currentTarget.dataset.idx,
            [current]:this.data.list[e.currentTarget.dataset.idx].name
        })

    },
    // 选择擅长技能
    chooseSkillList(e) {
        // 先检查选中的数组里面有没有这个值
        let bool=this.data.chooseSkillArr.includes(this.data.skillList[index].name);

        if(this.data.chooseSkillArr.length>4 && !bool) {
            wx.showToast({
                title: '最多只能选择5个技能'

            })
            return;
        }
        let index = Number(e.currentTarget.dataset.week);
        // 保存当前数组中的值
        let currentItemStatus = "skillList[" + index + "].selected";
        // 点击当前的第几个item
        let currentList2="list2[" + this.data.currentList2Index + "].text"
        let currentItem = this.data.skillList[index]
        // 保存选中的星期数组
        let arr = this.data.chooseSkillArr;

        this.setData({
            [currentItemStatus]: !this.data.skillList[index].selected
        })
        if (this.data.skillList[index].selected) {

            arr.push(currentItem)
            let str='';
            arr.forEach((item)=>{
                str+=item.name+','
            })
            this.setData({
                chooseSkillArr: arr,
               [currentList2]:str.substring(0,str.length-1)
            })
        } else {
            arr.forEach((item, idx) => {
                if (item.id == this.data.skillList[index].id) {
                    arr.splice(idx, 1)
                }
            })
            this.setData({
                chooseSkillArr: arr
            })
        }

    },
    // 选择星期几
    chooseWeekItem(e) {
        let index = Number(e.currentTarget.dataset.week);
        // 保存当前数组中的值
        let currentItemStatus = "weekList[" + index + "].selected";
        let currentItem = this.data.weekList[index]
        // 保存选中的星期数组
        let arr = this.data.chooseWeekList;
        this.setData({
            [currentItemStatus]: !this.data.weekList[index].selected
        })
        if (this.data.weekList[index].selected) {

            arr.push(currentItem)
            this.setData({
                chooseWeekList: arr
            })
        } else {
            // 去重删除取消选中的星期
            arr.forEach((item, idx) => {
                if (item.id == this.data.weekList[index].id) {
                    arr.splice(idx, 1)
                }
            })
            this.setData({
                chooseWeekList: arr
            })
        }

    },
    getTimer(e) {
        let hour = this.data.hour[e.detail.value[0]]
        this.setData({
            chooseHour: hour
        })

    },
    getTimer2(e) {
        let hour = this.data.hour2[e.detail.value[0]]
        this.setData({
            chooseHour1: hour
        })

    }


});