// signup.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: null,
    userInfo: null,
    error: null,
    checkedAgree: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      app.globalData.userInfo = userInfo;
    })

  },

  bindBtnLogin: function () {
    this.myLogin();
  },
  
  bindlog:function(){
    if (this.data.checkedAgree) {
      this.myLogin();
    }
    else{
      wx.showModal({
        title: '提示',
        content: '请同意用户协议',
        showCancel: false
      })
    }
  },

  checkboxChange: function (e) {
    this.setData({
      checkedAgree: e.detail.value.length
    })
  },

  bindOnXY: function () {
    wx.navigateTo({
      url: '../myAgree/myAgree',
    })
  },

  myLogin: function () {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
            success: function (userData) {
              
              app.globalData.userData = userData;
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo
                  var nickName = userInfo.nickName

                  Bmob.User.logIn(nickName, userData.openid, {
                    success: function (user) {
                      // Do stuff after successful login.
                      console.log("登录成功")

                      that.navigateBackFunc();
                      return;
                    },
                    error: function (user, error) {
                      // The login failed. Check error to see why.
                      console.log("登录失败")
                      console.log(error)
                    }
                  });

                  var user = new Bmob.User();//开始注册用户
                  user.set("username", nickName);
                  user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                  user.set("touxiang", userInfo.avatarUrl);
                  user.set("yueNum", 0);
                  user.set("userData", userData);
                  user.signUp(null, {
                    success: function (res) {
                      console.log("注册成功!");

                      that.navigateBackFunc();
                    },
                    error: function (userData2, error, nickName) {
                      console.log(error)
                    }
                  });
                }
              })
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  //返回上个页面
  navigateBackFunc: function () {

    var pages = getCurrentPages()

    var prevPage = pages[pages.length - 1]  //当前界面

    var prevPage = pages[pages.length - 2]  //上一个页面

    var that = this

    prevPage.setData({
      userInfo: that.data.userInfo
    })

    wx.navigateBack({
      delta: 1
    })

  }

})