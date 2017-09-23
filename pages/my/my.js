// my.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    user_avatarUrl:null,
    user_nickName:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用当前用户判断是否已经登陆
    var currentUser = Bmob.User.current();
    //已经登陆则直接跳转
    if (currentUser) {
      return;
    } 
    //微信用户登陆
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {
            success: function (userData) {

              app.globalData.userData = userData;
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo
                  var nickName = userInfo.nickName
               
                  Bmob.User.logIn(nickName, userData.openid, {
                    success: function (user) {
                      console.log("登录成功")
                      //关闭加载
                      wx.hideLoading();
                      that.setData({ user:user});
                      return;
                    },
                    error: function (user, error) {
                      console.log("登录失败")
                      console.log(error)
                      //未注册
                      wx.navigateTo({
                        url: '../signup/signup',
                      })
                    }
                  });
                }
              })
            },
            error: function (error) {
              console.log("Error: " + error.code + " " + error.message);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //响应点击头像事件
  bindMy: function () {
      wx.navigateTo({
        url: '../mySetting/mySetting',
      })
  },
  //响应底部添加按钮事件
  bindAdd: function () {
    //判断当前用户是否为摄影师
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
    } else{   //非摄影师跳转至摄影师申请界面
      wx.navigateTo({
        url: '../appSYS/appSYS',
      })
    }
  },

})