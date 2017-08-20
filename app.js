var Bmob = require('utils/bmob.js');
Bmob.initialize("a22827601758f1d1cd174d8bdccdc0cd", "e3f22b28497e4886709670430bb7d90c");

//app.js
App({
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userData: null,
  }
});
