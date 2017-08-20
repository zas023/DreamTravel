// myRelease.js
var Bmob = require('../../utils/bmob.js');
var app = getApp()

Page({

  data: {
    yuepais: [],
    modalHidden: true,

    viewid: 1,
    selectedId: null,
  },

  fetchData: function () {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true
    });

    var YuePai = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(YuePai);

    query.equalTo("author", app.globalData.userInfo.nickName);
    query.descending("updatedAt");
    query.find({
      success: function (results) {

        var l = that.data.yuepais.concat(results);

        that.setData({
          yuepais: l,
        });
        wx.hideLoading();

      },
      error: function (error) {
        wx.hideLoading();
      }
    });
  },

  
  //响应长按事件，弹出对话框
  bindDelet:function(e){
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

    this.data.yuepais[this.data.selectedId].destroy({
      success: function (myObject) {
        // 删除成功
        var User = Bmob.Object.extend("_User");
        var query = new Bmob.Query(User);
        query.get(Bmob.User.current().id, {
          success: function (result) {
            result.set("yueNum", result.get('yueNum') - 1);
            result.save();
          },
        });
        console.log("信息删除成功")

        var tempList = that.data.yuepais;
        var tempDel = that.data.yuepais[that.data.selectedId];

        that.removeByValue(tempList, tempDel);

        that.setData({
          modalHidden: !that.data.modalHidden,
          yuepais: tempList
        })
      },
      error: function (myObject, error) {
        // 删除失败
        console.log("信息删除失败")
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
    this.fetchData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      yuepais: []
    })
    this.fetchData();
  },
})