var http = require('../../utils/http.js');
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,

  },

  /**
   * 组件的初始数据
   */
  data: {
    multiArray:[[],[],[]]
  },
  ready(){
    http.request({
      method: 'GET',
      url: '/category/categoryInfo',
      data: {
        parentId: 0
      },
      callBack: (res) => {
       
        let arr = this.data.multiArray;
        arr[0] = res
        
        this.setData({
          multiArray: arr
        }, () => {
          console.log(res,'arr[0====]')
          
          this.getCategoryList(this.data.multiArray[0][0].categoryId, 1)
        
          // this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)
        
        
        
        })
      }
    
    })

  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    //console.log(this.data.item);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCategoryList(id, index) {
      http.request({
        method: 'GET',
        url: '/category/categoryInfo',
        data: {
          parentId: id
        },
        callBack: (res) => {
          let arr = this.data.multiArray;
          arr[index] = res

          this.setData({
            multiArray:this.data.multiArray.concat(arr)
          }, () => {
            console.log(this.data.multiArray,'multiarray')
            if(this.data.multiArray[2].length>0) return
            this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)
          })
        }
      
      })
    
    },
    pickerChange(e) {
    
      let column = e.detail.column
      console.log(column, 'column----')
      let value = e.detail.value
    
      if (column >= 2) return
      if (column == 0) {
        this.getCategoryList(this.data.multiArray[0][value].categoryId, 1)
        this.getCategoryList(this.data.multiArray[1][value].categoryId, 2)
      } else {
        this.getCategoryList(this.data.multiArray[1][value].categoryId, 2)
      }
    
      console.log(this.data.multiArray[column][value], 'e---')
    },
    bindchangeValue(e) {

      let selectArr = e.detail.value;
      if(!selectArr[2]){
        selectArr[2]=0;
      }
      let first = this.data.multiArray[0][selectArr[0]]
      let second = this.data.multiArray[1][selectArr[1]]
      let three = this.data.multiArray[2][selectArr[2]]
      console.log(this.data.multiArray[0][selectArr[0]], this.data.multiArray[1][selectArr[1]], this.data.multiArray[2][selectArr[2]])
      let str = first.categoryName + "-" + second.categoryName + '-' + three.categoryName

          this.triggerEvent('getCategory', {
                showCategoryName: str,
                yeCategoryId: first.categoryId,
                parentId:second.categoryId,
                CategoryId:three.categoryId,
          });
    },
  }
})