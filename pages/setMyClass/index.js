const app = getApp();
const http = require('../../utils/http')
Page({
      data: {
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
            chooseWeekList: [],
            certainTimesIndex: null,
            ListIndex: ['', '全部时间段', '按周'],
            // hour: [],
            // hour2: [],
            //
            //         weekItemIndex: 1,
            // currentIndex: 0,
            // showSkillModal: false,//是否技能等级模块
            // showOrderTimeModal: false, //是否显示选择时间模块
            // showSkillModalList: false,//是否显示擅长技能

            multiArray: [[], [], []],
            showCategoryName: '',
            query: {}
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
            http.request({
                  method: 'GET',
                  url: '/category/categoryInfo',
                  data: {
                        parentId: 0
                  },
                  callBack: (res) => {
                        res.splice(0, 1)
                        let arr = this.data.multiArray;
                        arr[0] = res

                        this.setData({
                              multiArray: arr
                        }, () => {


                              this.getCategoryList(this.data.multiArray[0][0].categoryId, 1)

                              // this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)


                        })
                  }

            })
      },
      chooseTime() {
            this.setData({
                  showOrderTimeModal: true
            })
      },
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
                              multiArray: arr
                        }, () => {
                              console.log(this.data.multiArray, 'multiarray')
                              if (this.data.multiArray[2].length > 0) return
                              this.getCategoryList(this.data.multiArray[1][0].categoryId, 2)
                        })
                  }

            })

      },
      bindchangeValue(e) {
            console.log(e, '拉克打飞机')
            let selectArr = e.detail.value;
            if (!selectArr[2]) {
                  selectArr[2] = 0;
            }
            let first = this.data.multiArray[0][selectArr[0]]
            let second = this.data.multiArray[1][selectArr[1]]
            let three = this.data.multiArray[2][selectArr[2]]
            console.log(this.data.multiArray[0][selectArr[0]], this.data.multiArray[1][selectArr[1]], this.data.multiArray[2][selectArr[2]])
            let str = first.categoryName + "-" + second.categoryName + '-' + three.categoryName
            this.setData({
                  showCategoryName: str,
                  'query.yeCategoryId': first.categoryId,
                  "query.parentId": second.categoryId,
                  "query.CategoryId": three.categoryId,
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
      getChangeValuse(e) {
            let key = e.currentTarget.dataset.item
            this.setData({
                  [`query.${key}`]: e.detail.value
            })

      },
      OnSubmit() {

            if (!this.data.query.yeCategoryId || !this.data.query.parentId || !this.data.query.CategoryId) {
                  wx.showModal({
                        title: '提示',
                        content: '请选择所教的课程',
                        showCancel: false
                  })
                  return
            }
            if (!this.data.chooseWeekList) {
                  wx.showModal({
                        title: '提示',
                        content: '请选择接单时间',
                        showCancel: false
                  })
                  return
            }
            if (!this.data.query.orderPrice) {
                  wx.showModal({
                        title: '提示',
                        content: '请输入您的课程价格 ',
                        showCancel: false
                  })
                  return
            }
            if (!this.data.query.mobile) {
                  wx.showModal({
                        title: '提示',
                        content: '请输您的手机号 ',
                        showCancel: false
                  })
                  return
            }
            let arr = []
            console.log(this.data.chooseWeekList, '阿里山的咖啡机')
            this.data.chooseWeekList.forEach((week) => {
                  arr.push(week.id);
            })
            if (arr.length == 0) arr = [1, 2, 3, 4, 5, 6, 7]
            this.setData({
                  "query.weekTime": arr.toString(),
                  'query.orderPrice': this.data.orderPrice * 100
            })
            console.log(this.data.query, 'query--')

            http.request({
                  url: '/trainer/setTrainerInfo',
                  data: this.data.query,
                  callBack: (res) => {
                        wx.showToast({
                              title: '修改成功'
                        })
                        wx.switchTab({
                              url: '/pages/user/user'
                        })
                  }
            })
      },
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

            console.log(arr, 'arr--')

      },
      closeModal(e) {

            this.setData({
                  showOrderTimeModal: false
            })

      },

      // 获取当前输入的价格
      getOrderPrice(e) {
            let type = e.currentTarget.dataset.type;

            this.setData({
                  [`query.${type}`]: e.detail.value
            })
      },
      // 点击模块时间分类事件
      chooseTimeTum(e) {


            this.setData({
                  certainTimesIndex: e.currentTarget.dataset.cur,

            })
      },
      // 选择技能等级


});