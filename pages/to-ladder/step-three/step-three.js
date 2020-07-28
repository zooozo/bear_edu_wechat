Page({
    data: {
        list:[
            {name:'业余一级',text:'刚学羽毛球，不会拿拍，打球总是打不到，对于羽毛球，有兴趣的就打打 ，没有兴趣了，可能一年半载打不了一次！'},
            {name:'业余二级',text:'对羽毛球刚刚有“瘾”，一旦有“瘾”，这就是一个好现象，最喜欢打直来直去的中场“高远球”，能接住很多拍，稍微耍点技术手段，他就会接不到球！'},
            {name:'业余三级',text:'开始知道打羽毛球不是为了让对方接住，而是为了不让对方接住，是二级的升级版，不再限于打高球，开始打平抽和杀球！'}
        ],
        list2:[
            {name:'技能等级',text:'请选择场馆'},
            {name:'接单时间',text:'请选择时间段'},
            {name:'擅长技能',text:'请选择擅长技能'},
            {name:'接单价格',text:'¥100/1小时'},
        ],
        currentIndex:0,
        showSkillModal:false,
        showOrderTimeModal:false,
        showSkillModalList:false,
    },
    onLoad: function (options) {

    },
    selectSkill(e){
        this.setData({
            currentIndex:e.currentTarget.dataset.idx
        })
    },
    closeModal(){
        this.setData({
            showSkillModal:false
        })
    },
    showCurrentModal(){
        let index=Number(e.currentTarget.dataset.currentIndex)
        this.setData({
            showSkillModal:index===0,
            showOrderTimeModal:index===1,
            showSkillModalList:index==2,
        })
    }
});