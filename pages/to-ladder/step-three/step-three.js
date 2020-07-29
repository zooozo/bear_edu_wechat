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
        hour: [

        ],
        hour2: [

        ],

        currentIndex: 0,
        showSkillModal: false,
        showOrderTimeModal: false,
        showSkillModalList: false,
        animationData: {},
        ModalStatus: 'close',
        certainTimesIndex: 1,
        weekItemIndex: 1,
        chooseWeekList:[],
    },
    onLoad: function (options) {
        app.globalData.params = {}
        let arr=[]
        for(let i=1;i<=24;i++){
            if(i<10){
                arr.push('0'+i)
            }else{
                arr.push(i+"")
            }
        }
        for(let i=1;i<=24;i++){
            if(i<10){
                arr.push('0'+i)
            }else{
                arr.push(i+"")
            }
        }
        this.setData({
            hour:arr,
            hour2:arr
        })
        console.log(arr,'arr--')
    },
    selectSkill(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.idx
        })
    },
    closeModal(e) {
        this.util(this.data.showSkillModalList);
        if (e.currentTarget.dataset.choose == 'choose') {
            app.globalData.params.skillLevel = this.data.currentIndex;
        }
        this.setData({
            showSkillModal: false
        })
        this.util();
    },

    showCurrentModal(e) {
        console.log(e, 'e-----')
        this.util();
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
    // 选择星期几
    chooseWeekItem(e) {
        let index = Number(e.currentTarget.dataset.week);
        // 保存当前数组中的值
        let currentItemStatus ="weekList[" + index + "].selected";
        let currentItem=this.data.weekList[index]
        // 保存选中的星期数组
        let  arr=this.data.chooseWeekList;
        this.setData({
            [currentItemStatus]: !this.data.weekList[index].selected
        })
        if(this.data.weekList[index].selected){
            console.log(arr,currentItemStatus,'arr----')
            arr.push(currentItem)
           this.setData({
               chooseWeekList:arr
           })
        }else{
            // 去重删除取消选中的星期
            arr.forEach((item,idx)=>{
                if(item.id==this.data.weekList[index].id){
                    arr.splice(idx,1)
                }
            })
            this.setData({
                chooseWeekList:arr
            })
        }

    },
    util(currentStatus) {
        /* 动画部分 */
        // 第1步：创建动画实例
        let that = this
        var animation = wx.createAnimation({
            duration: 200,  //动画时长
            timingFunction: "linear", //线性
            delay: 0  //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例


        // 第3步：执行第一组动画
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭
            console.log(that.data.ModalStatus, '2222')
            if (that.data.ModalStatus == "close") {
                that.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
            console.log(that.data.showModalStatus, '2222')
            // this.setData(
            //     {
            //         showSkillModal: false
            //     }
            // );

        }.bind(this), 200)

        // 显示
        if (that.data.ModalStatus == "open") {
            this.setData(
                {
                    showModalStatus: true
                }
            );
        }
    }


});