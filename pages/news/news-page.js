const app = getApp();
Page({
    data: {
        allConversation: '',
        modalVisible: false,
        currentConversation: null
    },
    onLoad: function (options) {
        // if (!this.isSdkReady) {
        //     wx.showLoading({title: '正在同步数据', mask: true})
        // }
        // fromAccount: "user0"
        // isRevoked: false
        // lastSequence: 1626350002
        // lastTime: 1598430713

    },
    onShow() {
        console.log(app.globalData.$TIM, 'messageData---')
        this.setData({
            allConversation: app.globalData.$TIM.tim.DBCenter.MessageList
        })
    },
    longTimePress(e) {
        let item = this.data.allConversation[e.currentTarget.dataset.current]

        wx.showModal({
            title: '提箱',
            content: '确认删除改对话',
            success: (res) => {
                console.log(res, 'res---');
                if (res.confirm) {
                    // this.setData({
                    //     currentConversation:item
                    // })
                    this.deleteConversation(item)
                }
            }
        })
    },
    handleModalShow() {
        this.setData({
            modalVisible: !this.data.modalVisible
        })

    },
    // 将某会话设为已读
    setMessageRead(item) {
        // if (item.unreadCount === 0) {
        //     return
        // }
        // tim.setMessageRead({
        //     conversationID: item.conversationID
        // })
    },
    // 点击某会话
    checkoutConversation(e) {
        // (item, item.userProfile.nick || item.userProfile.userID)
        let index = e.currentTarget.dataset.current
        let item = this.data.allConversation[index];
        // this.$store.dispatch('checkoutConversation', item.conversationID)
        let conversationID = item.conversationID;
        app.globalData.$TIM.tim.setMessageRead({conversationID})
        return app.globalData.$TIM.tim.getConversationProfile(conversationID)
            .then(({data: {conversation}}) => {
                console.log(conversation, 'conversation-----')
                // context.commit('updateCurrentConversation', conversation)
                // 保存当前点击的聊天信息
                app.globalData.currentConversation = conversation

                let name = ''
                switch (conversation.type) {
                    case  app.globalData.$TIM.tim.TYPES.CONV_C2C:
                        name = conversation.userProfile.nick || conversation.userProfile.userID
                        break
                    case  app.globalData.$TIM.tim.TYPES.CONV_GROUP:
                        name = conversation.groupProfile.name || conversation.groupProfile.groupID
                        break
                    default:
                        name = '系统通知'
                }
                wx.navigateTo({url: `./chat/index?toAccount=${name}&type=${conversation.type}`})
                return Promise.resolve()
            })
    },
    // // 点击系统通知时，处理notification
    // checkoutNotification(item) {
    //     this.$store.commit('resetCurrentConversation')
    //     this.$store.commit('resetGroup')
    //     this.setMessageRead(item)
    //     wx.$app.getConversationProfile(item.conversationID)
    //         .then((res) => {
    //             this.$store.commit('updateCurrentConversation', res.data.conversation)
    //             this.$store.dispatch('getMessageList')
    //         })
    //     let url = '../system/main'
    //     wx.navigateTo({url})
    // },
    // 删除会话
    deleteConversation(item) {
        let that = this;
        // 像IM发送删除会话
        app.globalData.$TIM.tim.deleteConversation(item.conversationID).then((res) => {
            console.log('delete success', res)
            // 获取监听改变后的数据
            that.setData({
                allConversation: app.watch(this, app.globalData.$TIM.MessageList)
            })

        })
    },
    empty() {
        let url = '../search/main'
        wx.navigateTo({url})
    }
})
