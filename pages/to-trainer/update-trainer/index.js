const app = getApp()
const http = require('../../../utils/http.js')
Page({
    data: {
        showSkillModal: false,//是否技能等级模块
        showOrderTimeModal: false, //是否显示选择时间模块
        showSkillModalList: false,//是否显示擅长技能,
        list: [
            {name: '业余一级', text: '刚学羽毛球，不会拿拍，打球总是打不到，对于羽毛球，有兴趣的就打打 ，没有兴趣了，可能一年半载打不了一次！', type: 1},
            {name: '业余二级', text: '对羽毛球刚刚有“瘾”，一旦有“瘾”，这就是一个好现象，最喜欢打直来直去的中场“高远球”，能接住很多拍，稍微耍点技术手段，他就会接不到球！', type: 2},
            {name: '业余三级', text: '开始知道打羽毛球不是为了让对方接住，而是为了不让对方接住，是二级的升级版，不再限于打高球，开始打平抽和杀球！', type: 3}
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
        currentList2Index: 0,
        currentIndex: 0,
        weekItemIndex: 1,
        chooseWeekList: [],
        chooseSkillArr: [],
        chooseHour: '',
        chooseHour1: '',
        pageShowData: {},
        clickCount: 0,
        certainTimesIndex: 0,//选择是全部时间段还是按周
        orderPrice:null,
        params: {
            orderTime: '',
            receivingType: '',
            skillLevel: ''
        }
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
    onReady() {
        console.log(app.globalData.userInfo)
        // let id=app.globalData.userInfo.userId;
        this.getTrainer(22);
    },
    getTrainer(id) {
        app.globalData.isLanding = true;
        http.request({
            url: '/trainer/queryTrainer',
            method: 'GET',
            data: {
                userId: id
            },
            callBack: res => {
                // let current = "list2[" + index + "].text"
                let time = res.orderTime.split(',')
                let chooseArr=res.begoodSkill.split(',')
                let type=res.receivingType==1?'全部时间段':'按周'
                let txt='',num=Number(res.skillLevel)
                if(num==1){
                    txt='业余一级'
                }else if(num==2){
                    txt='业余二级'
                }else{
                    txt="业余三级"
                }
               // 设置他之前选择的技能选中状态
                chooseArr.forEach((item)=>{
                    let selectIndex=this.data.skillList.findIndex((itm)=>itm.name==item)
                    if(selectIndex>-1){
                        let cur="skillList[" + selectIndex + "].selected";
                        this.setData({
                            [cur]:true,

                        })
                    }

                })


                this.setData({
                    chooseHour: time[0],
                    chooseHour1: time[1],
                    currentIndex:res.skillLevel-1,
                    certainTimesIndex:res.receivingType,
                    orderPrice:parseInt(res.orderPrice/100),
                    "list2[0].text":txt,
                    "list2[1].text":type,
                    'list2[2].text':res.begoodSkill,
                    'params.trainerImg':res.trainerImg,
                    'params.begoodSkill':res.begoodSkill,
                    'params.trainerDescribe':res.trainerDescribe,
                    chooseSkillArr:chooseArr.filter((item)=>item.length>0),


                })
            }
        }, false)
    },
    // app.globalData.params.orderTime=this.data.chooseHour+","+this.data.chooseHour1
    // app.globalData.params.skillLevel = Number(this.data.currentIndex)+1;
    // app.globalData.params.receivingType=this.data.certainTimesIndex;
    // app.globalData.params.userId=app.globalData.userInfo.userId;
    // app.globalData.params.nickName=app.globalData.userInfo.nickName;

    updateTrainer() {

        let time = this.data.hour.slice(this.data.chooseHour, Number(this.data.chooseHour1) + 1).toString();


        this.setData({
           " params.begoodSkill":this.data.chooseSkillArr,
            'params.userId': app.globalData.userInfo.userId,
            'params.nickName': app.globalData.userInfo.nickName,
            "params.receivingType": Number(this.data.certainTimesIndex),
            "params.skillLevel": Number(this.data.currentIndex) + 1,
            "params.orderTime": time,
            "params.orderPrice": this.data.orderPrice*100,
            "params.weekTime": this.data.certainTimesIndex==1?'1,2,3,4,5,6,7':this.data.params.weekTime
        })

        if (!this.data.params) {
            wx.showModal({
                title: '提示',
                content: '请至少修改一项',
                showCancel: false
            })
            return
        }
        http.request({
            url: '/trainer/setTrainerInfo',
            data: this.data.params,
            callBack: (res) => {
                console.log(res, 'res----')
            }
        })
    },
    getIntroduce(e) {
        this.setData({
            "params.trainerDescribe": e.detail.value
        })

    },
    getOrderPrice(e) {
        let num = e.detail.value * 100;
        this.setData({
            'params.orderPrice': num
        })
    },

    // 判断当前点击是哪个需要选择的
    showCurrentModal(e) {

        let index = e.currentTarget.dataset.current
        console.log(index, 'index---')
        // let num=this.data.clickCount
        // num++

        switch (index) {
            case 0:

                // 先给一个默认的，
                this.setData({
                    showSkillModal: true,

                    // clickCount:num,

                })

                break;
            case 1:
                this.setData({
                    showOrderTimeModal: true,

                    // clickCount:num,

                })

                break;
            case 2:
                this.setData({
                    showSkillModalList: true,

                    // clickCount:num,

                })
                break;
        }
        this.setData({
            currentList2Index: index
        })
    },
    // 点击完成的时候记录选择的值
    closeModal(e) {
        if (e.currentTarget.dataset.choose == 'chooseSkillLeave') {
            this.setData({
                showSkillModal: false
            })
        }
        else if (e.currentTarget.dataset.choose == 'chooseTime') {
            // 如果当前选择是全部时间段  certainTimesIndex   1：全部   2:按周
            if (this.data.certainTimesIndex == 1) {
                this.setData({
                    'params.weekTime' : '1,2,3,4,5,6,7'
                })

            } else {
                if (!this.data.chooseHour || !this.data.chooseHour1) {
                    wx.showModal({
                        title: '提示',
                        content: '请选择接单小时区间 ',
                        showCancel: false
                    })
                    return
                }

                // 今天
                let today = new Date();
                console.log(today)


                // 今天星期几
                let week = today.getDay();//获取存储当前日期
                console.log(week)
                this.data.chooseWeekList.sort((item) => {
                    return item['id'] - item['id']
                })
                let weekStr = ''
                this.data.chooseWeekList.forEach((item) => {
                    weekStr += item.id + ","

                })
                this.setData({
                    'params.weekTime' : weekStr.substring(0,weekStr.length-1)
                })



            }

            this.setData({
                showOrderTimeModal: false
            })
        }
        else if (e.currentTarget.dataset.choose == 'chooseSkill') {
            // begoodSkill
            if (this.data.chooseSkillArr.length == 0) {
                wx.showModal({
                    title: '提示',
                    content: '请选择擅长技能 ',
                    showCancel: false
                })
                return
            }
            // let str = ''
            // this.data.chooseSkillArr.forEach((item) => {
            //     console.log(item, 'item---')
            //     str += item.name + ',';
            // })
            this.setData({
                "params.begoodSkill": this.data.chooseSkillArr.toString()
            })
            console.log(this.data.params.begoodSkill)

            this.setData({
                showSkillModalList: false
            })
        }
        else {
            // 点击了X之后就取消之前的转态

            let current = "list2[" + this.data.currentList2Index + "].text"
            console.log(this.data.currentList2Index,'111111111111111111')
            switch (this.data.currentList2Index) {
                case 0:
                    this.setData({
                        showSkillModal: false,
                        [current]: "请选择技能等级"
                    })

                    break;
                case 1:
                    this.setData({
                        showOrderTimeModal: false,
                        [current]: "请选择时间段"
                    })

                    break;
                case 2:

                   this.data.chooseSkillArr.forEach((item,index)=>{

                      let idx=this.data.skillList.findIndex((itm)=>item.id==itm.id)
                       if(idx>-1){
                           let current="skillList[" + idx + "].selected";
                           this.setData({
                               [current]:false
                           })
                       }

                   })
                    this.setData({
                        showSkillModalList: false,
                        chooseSkillArr: [],
                        [current]: "请选择擅长技能"
                    })
                    console.log(this.data.skillList,'list----')
                    break;
            }
        }


    },
    // 选择技能等级
    selectSkill(e) {

        let current = "list2[" + this.data.currentList2Index + "].text"
        this.setData({

            currentIndex: e.currentTarget.dataset.idx,
            [current]: this.data.list[e.currentTarget.dataset.idx].name
        })

    },
    // 选择时间是按周还是全部时间段
    chooseTimeTum(e) {

        let current = "list2[" + this.data.currentList2Index + "].text"
        console.log(current, 'current---')
        let txt = e.currentTarget.dataset.cur == 1 ? '全部时间段' : '按周'
        this.setData({
            certainTimesIndex: e.currentTarget.dataset.cur,
            [current]: txt
        })
    },
    // 选择擅长技能
    chooseSkillList(e) {
        // arr.includes('baidu')


        let index = Number(e.currentTarget.dataset.week);
        // 先检查选中的数组里面有没有这个值
        let bool=this.data.chooseSkillArr.includes(this.data.skillList[index].name);
        if (this.data.chooseSkillArr.length > 4 && !bool) {
            wx.showToast({
                title: '最多只能选择5个技能'

            })
            return;
        }
        // 保存当前数组中的值
        let currentItemStatus = "skillList[" + index + "].selected";
        // 点击当前的第几个item
        let currentList2 = "list2[" + this.data.currentList2Index + "].text"
        let currentItem = this.data.skillList[index].name
        // 保存选中的星期数组
        let arr = this.data.chooseSkillArr;
        console.log(arr,'arr----')
        this.setData({
            [currentItemStatus]: !this.data.skillList[index].selected
        })
        if (this.data.skillList[index].selected) {

            arr.push(currentItem)
            let str = '';
            arr.forEach((item) => {
                str += item + ','
            })

            this.setData({
                chooseSkillArr: arr,
                [currentList2]: str
            })
            console.log(str,'chosseArrr')
        } else {
            let str = '';
            arr.forEach((item, idx) => {
                if (item == this.data.skillList[index].name) {
                    arr.splice(idx, 1)
                }
            })
            arr.forEach((item) => {
                str += item + ','
            })
            this.setData({
                chooseSkillArr: arr,
                [currentList2]: str
            })
        }

    },
    // 选择星期几
    chooseWeekItem(e) {
        let index = Number(e.currentTarget.dataset.week);
        // 保存当前数组中的值
        let currentItemStatus = "weekList[" + index + "].selected";
        // 当前选中值得状态
        let currentItem = this.data.weekList[index]
        // 保存选中的星期数组
        let arr = this.data.chooseWeekList;
        this.setData({
            [currentItemStatus]: !this.data.weekList[index].selected
        })
        if (this.data.weekList[index].selected) {
            console.log(arr, currentItemStatus, 'arr----')
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
        let index = this.data.hour.findIndex((item) => item === hour)
        console.log(index, 'index----')
        this.setData({
            chooseHour: index
        })

    },
    getTimer2(e) {
        let hour = this.data.hour2[e.detail.value[0]]
        let index = this.data.hour2.findIndex((item) => item === hour)
        this.setData({
            chooseHour1: index
        })

    },
    // 选择大张图片
    chooseLocalImage() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // console.log(res,'res---')
                this.setData({
                    "params.trainerImg": res.tempFilePaths[0]
                })
            }
        })
    },
    deleteImage() {
        this.setData({
            'params.trainerImg': null
        })
    },
});