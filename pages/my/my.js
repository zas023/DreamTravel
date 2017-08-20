// my.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
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
  },
  //响应点击头像事件
  bindMy: function () {
    var currentUser = Bmob.User.current();
    if (!currentUser) {
      // show the signup or login page
      wx.navigateTo({
        url: '../signup/signup',
      })
    } else {
      wx.navigateTo({
        url: '../mySetting/mySetting',
      })
    }
  },
  bindAdd: function () {

    if (Bmob.User.current().get('isSYS')) {

      wx.showActionSheet({
        itemList: ['发布信息', '添加作品'],
        itemColor: "#f7982a",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              wx.navigateTo({
                url: '../addRelease/addRelease',
              })
            } else if (res.tapIndex == 1) {
              wx.navigateTo({
                url: '../addWork/addWork',
              })
            }
          }
        }
      })
    } else{
      wx.navigateTo({
        url: '../appSYS/appSYS',
      })
    }
  },

})