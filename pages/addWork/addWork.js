// addWork.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '../../images/works_button_add.png',
    inputDes: null,
    imgUrl: null,
  },
  //选择图片
  chooseImage: function () {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        that.setData({
          imgPath: res.tempFilePaths[0],
        })

        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          var timestamp = (new Date()).valueOf();
          var name = timestamp + ".jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          file.save().then(function (res) {
            that.setData({
              imgUrl: res.url(),
            })
            console.log(that.data.imgUrl);
          }, function (error) {
            console.log(error);
          })
        }
      }
    });
  },

  inputDes: function (e) {
    this.data.inputDes = e.detail.value;
  },

  bindSaveTap: function () {

    if (this.data.imgUrl) {
      var Work = Bmob.Object.extend("Work");
      var work = new Work();
      console.log(this.data.imgUrl);
      work.set("author", app.globalData.userInfo.nickName);
      work.set("image", this.data.imgUrl);
      work.set("content", this.data.inputDes);
      work.set("comment", '0');
      work.set("mark", '0');
      //添加数据，第一个入口参数是null
      work.save(null, {
        success: function (result) {
          // 添加成功
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 5000,
            complete:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
          
        },
        error: function (result, error) {
          // 添加失败
          console.log('创建失败');
          wx.showToast({
            title: '添加失败',
            duration: 3000,
          })
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择作品',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})