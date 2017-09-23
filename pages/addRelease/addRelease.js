// addRelease.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    cost: '',
    unit: '',
    photoNum: '',
    psNum: '',
    film: ['不支持','支持'],
    filmIndex:0,
    custom: ['不提供', '提供'],
    customIndex:0,
    imgPaths: [],
    uploadPaths: [],
    buttonLoading: false,
  },
  //监听输入
  inputTitle: function (e) {
    this.data.title = e.detail.value;
  },

  inputContent: function (e) {
    this.data.content = e.detail.value;
  },
  inputCost: function (e) {
    this.data.cost = e.detail.value;
  },
  inputUnit: function (e) {
    this.data.unit = e.detail.value;
  },
  inputPhotoNum: function (e) {
    this.data.photoNum = e.detail.value;
  },
  inputPsNum: function (e) {
    this.data.psNum = e.detail.value;
  },
  bindFilmChange: function (e) {
    this.setData({
      filmIndex: e.detail.value,
    })
  },
  bindCustomChange: function (e) {
    this.setData({
      customIndex: e.detail.value,
    })
  },
  //监听提交button
  bindSubmit: function () {
    //验证是否填写完善必要信息
    if (this.data.title == '' || this.data.content == '' || this.data.cost == '' || this.data.unit == ''
      || this.data.photoNum == '' || this.data.psNum == '' || this.data.film == '' || this.data.custom == '') {
      wx.showModal({
        title: '提示',
        content: '请填写必要信息',
        showCancel: false
      });
      return;
    }
    this.uploadInfo();

  },
  uploadInfo: function () {
    var currentUser = Bmob.User.current();
    //验证当前用户
    if (!currentUser) {
      wx.showModal({
        title: '提示',
        content: '请先登陆',
        showCancel: false
      });
      return;
    }
    
    wx.showLoading({
      title: '正在提交...',
    })
    var YuePai = Bmob.Object.extend("YuePai");

    var yuepai = new YuePai();
    yuepai.set("user", currentUser);
    yuepai.set("author", currentUser._serverData.username);
    yuepai.set("touxiang", currentUser._serverData.touxiang);
    yuepai.set("mark", 0);

    yuepai.set("images", this.data.uploadPaths);
    yuepai.set("title", this.data.title);
    yuepai.set("content", this.data.content);
    yuepai.set("cost", this.data.cost);
    yuepai.set("unit", this.data.unit);
    yuepai.set("photoNum", this.data.photoNum);
    yuepai.set("psNum", this.data.psNum);
    yuepai.set("film", this.data.film[this.data.filmIndex]);
    yuepai.set("custom", this.data.custom[this.data.customIndex]);

    //添加数据，第一个入口参数是null
    yuepai.save(null, {
      
      success: function (result) {
        // 添加成功
        var User = Bmob.Object.extend("_User");
        var query = new Bmob.Query(User);
        query.get(Bmob.User.current().id, {
          success: function (result) {
            result.set("yueNum", result.get('yueNum') + 1);
            result.save();
          },
          error: function (object, error) {
            console.log('失败', object, error)
          }
        });
        wx.hideLoading();
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 5000,
          complete: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        });
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建失败', error);
        wx.hideLoading();
        wx.showToast({
          title: '添加失败',
          duration: 3000,
        })
      }
    });
  },
  //删除已选图片
  deletImage: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    app.requestDetailid = id;

    wx.showModal({
      title: '提示',
      content: '是否删除此照片',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          //移除要删除的本地图片路径
          var tempList = that.data.imgPaths;
          var tempDel = that.data.imgPaths[e.currentTarget.id];
          that.removeByValue(tempList, tempDel);
          //移除要删除的服务器图片路径
          var tempList1 = that.data.uploadPaths;
          var tempDel1 = that.data.uploadPaths[e.currentTarget.id];
          that.removeByValue(tempList1, tempDel1);
          // //删除服务器上的此图片
          // var path = tempDel1;
          // var s = new Bmob.Files.del(path).then(function (res) {
          //   if (res.msg == "ok") {
          //     console.log('图片删除成功');
          //   }
          // },);
          //更新数据
          that.setData({
            imgPaths: tempList,
            uploadPaths: tempList1,
          })
        }
      }
    });
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

  //选择图片
  chooseImage: function () {
    let that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var l = that.data.imgPaths.concat(res.tempFilePaths);
        that.setData({
          imgPaths: l,
        })

        var tempFilePaths = res.tempFilePaths;

        var imgLength = tempFilePaths.length;
        var urlArr = that.data.uploadPaths;
        if (imgLength > 0) {

          var timestamp = (new Date()).valueOf();

          var j = 0;
          //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = timestamp + "." + extension;//上传的图片的别名      

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();

              urlArr.push(res.url());

              j++;
              that.setData({
                uploadPaths: urlArr
              })

              console.log(urlArr)

            }, function (error) {
              console.log(error)
            });

          }

        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})

