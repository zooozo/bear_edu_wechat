var http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots:true
  },
  properties: {
    title:String,
    modalHeight:String,
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
    closeModal(){
      console.log("111")
      this.triggerEvent('PostStatus', {
        status:false
      });
    }
  }
})