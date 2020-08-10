var http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    //console.log(this.data.item);
  },
  /**
   * 组件的方法列表
   */
  methods: {

    goToSpace(e){
      let currentItem=e.currentTarget.dataset.current
      if(currentItem.orderPrice && Number(currentItem.orderPrice>0)){
        wx.navigateTo({
          url:'/pages/training-space/index?userId='+currentItem.userId
        })
      }else{
        wx.navigateTo({
          url:'/pages/personal-space/index?userId='+currentItem.userId
        })
      }

    }
  }
})