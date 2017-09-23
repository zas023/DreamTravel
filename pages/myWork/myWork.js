// myWork.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    works: [],
    modalHidden: true,

    viewid: 1,
    selectedId: null,
  },

  //响应长按事件，弹出对话框
  bindDelet: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    app.requestDetailid = id;

    this.setData({
      modalHidden: !this.data.modalHidden,
      selectedId: e.currentTarget.id
    })
  },
  //响应对话框确定事件
  modalBindaconfirm: function () {

    var that = this;

    this.data.works[this.data.selectedId].destroy({
      success: function (myObject) {
        // 删除成功
        console.log("作品删除成功")

        var tempList = that.data.works;
        var tempDel = that.data.works[that.data.selectedId];

        that.removeByValue(tempList, tempDel);

        that.setData({
          modalHidden: !that.data.modalHidden,
          works: tempList
        })
      },
      error: function (myObject, error) {
        // 删除失败
        console.log("作品删除失败")
      }
    });

  },
  //响应对话框取消事件
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })

  },
  //移除数组中的某一项
  removeByValue: function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentUser = Bmob.User.current();
    if (!currentUser) {
      // show the signup or login page
      wx.navigateTo({
        url: '../signup/signup',
      })
    }

    this.setData({
      id: options.id,
      author: options.author
    });

    this.fetchData();

  },

  onPullDownRefresh: function () {
    this.setData({
      works: []
    })
    this.fetchData();
  },

  fetchData: function () {
    var that = this;
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });

    var Work = Bmob.Object.extend("Work");
    //创建查询对象，入口参数是对象类的实例
    var work = new Bmob.Query(Work);
    work.equalTo("author", Bmob.User.current().get('username'));
    //查询单条数据，第一个参数是这条数据的objectId值
    work.descending("updatedAt");
    work.find({
      success: function (results) {
        that.setData({
          works: results
        });
      },
      error: function (error) {

      }
    });

    wx.hideLoading();
  }


})