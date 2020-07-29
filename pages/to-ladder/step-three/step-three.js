const app = getApp();

Page({
    data: {
        list: [
            {name: '业余一级', text: '刚学羽毛球，不会拿拍，打球总是打不到，对于羽毛球，有兴趣的就打打 ，没有兴趣了，可能一年半载打不了一次！', type: 1},
            {name: '业余二级', text: '对羽毛球刚刚有“瘾”，一旦有“瘾”，这就是一个好现象，最喜欢打直来直去的中场“高远球”，能接住很多拍，稍微耍点技术手段，他就会接不到球！', type: 2},
            {name: '业余三级', text: '开始知道打羽毛球不是为了让对方接住，而是为了不让对方接住，是二级的升级版，不再限于打高球，开始打平抽和杀球！', type: 3}
        ],
        list2: [
            {name: '技能等级', text: '请选择场馆'},
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

        currentIndex: 0,
        showSkillModal: false,//是否技能等级模块
        showOrderTimeModal: false, //是否显示选择时间模块
        showSkillModalList: false,//是否显示擅长技能

        ModalStatus: 'close',
        certainTimesIndex: 1,
        weekItemIndex: 1,
        chooseWeekList: [],
        chooseSkillArr: [],
        chooseHour: '',
        chooseHour1: '',

    },
    onLoad: function (options) {
        app.globalData.params = {}
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
    submit(){
        app.globalData.params.orderTime=this.data.chooseHour+""+this.data.chooseHour1
    },
    selectSkill(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.idx
        })
    },
    closeModal(e) {

        if (e.currentTarget.dataset.choose == 'chooseSkillLeave') {
            app.globalData.params.skillLevel = this.data.currentIndex;
            this.setData({
                showSkillModal: false
            })
        } else if (e.currentTarget.dataset.choose == 'chooseTime') {
            // 如果当前选择是全部时间段  certainTimesIndex   1：全部   2:按周
            if (this.data.certainTimesIndex == 1) {
                app.globalData.params.orderDate = '';
                app.globalData.params.weekTime = '';
            } else {
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
                let sconds = 24 * 3600 * 1000
                let str = '', weekStr = ''
                this.data.chooseWeekList.forEach((item) => {

                    let day, num;
                    if (week - item.id >= 0) {
                        // 如果今天的星期减去当前item的星期大于0的话就是选的今天前面的
                        // 算出后一个星期的日期的查额
                        num = 7 - (week - item.id)
                        day = new Date(today.getTime() + (num * sconds))
                        console.log(day.getDate(), 'day---');
                    } else {
                        day = new Date(today.getTime() + (item.id - week) * sconds)

                    }
                    str += day.getDate() + ','
                    weekStr += item.id + ","

                })
                app.globalData.params.orderDate = str;
                app.globalData.params.weekTime = weekStr;


            }

            this.setData({
                showSkillModal: false
            })
        }

        this.util();
    },

    showCurrentModal(e) {

        let index = e.currentTarget.dataset.current
        console.log(index, 'index---')
        switch (index) {
            case 0:
                this.setData({
                    showSkillModal: true,

                })

                break;
            case 1:
                this.setData({
                    showOrderTimeModal: true,

                })

                break;
            case 2:
                this.setData({
                    showSkillModalList: true,

                })
                break;
        }
        this.setData({
            ModalStatus: 'open'
        })
    },
    // 点击时间段事件
    chooseTimeTum(e) {
        this.setData({
            certainTimesIndex: e.currentTarget.dataset.cur
        })
    },
    chooseSkillList(e) {

        if(this.data.chooseSkillArr.length>4){
            wx.showToast({
                title: '最多只能选择5个技能'

            })
            return;
        }
        let index = Number(e.currentTarget.dataset.week);
        // 保存当前数组中的值
        let currentItemStatus = "skillList[" + index + "].selected";
        let currentItem = this.data.skillList[index]
        // 保存选中的星期数组
        let arr = this.data.chooseSkillArr;

        this.setData({
            [currentItemStatus]: !this.data.skillList[index].selected
        })
        if (this.data.skillList[index].selected) {

            arr.push(currentItem)

            this.setData({
                chooseSkillArr: arr
            })
        } else {
            // 去重删除取消选中的星期
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