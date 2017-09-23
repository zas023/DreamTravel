// myRelease.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
Page({

  data: {
    yuepais: [],
    selectedId: null,

    editHidden:true,

    title: '',
    content: '',
    cost: '',
    unit: '',
    photoNum: '',
    psNum: '',
    film: ['不支持', '支持'],
    filmIndex: 0,
    custom: ['不提供', '提供'],
    customIndex: 0,
    imgPaths: [],
    uploadPaths: [],
    buttonLoading: false,
  },
  //获取当前用户发布的所有信息数据
  fetchData: function () {

    var that = this;

    wx.showLoading({
      title: '请稍候...',
      mask: true
    });

    var YuePai = Bmob.Object.extend("YuePai");
    var query = new Bmob.Query(YuePai);

    query.equalTo("author", Bmob.User.current().get('username'));
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

    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          //选择编辑信息
          if (res.tapIndex == 0) {
            that.setData({
              title: that.data.yuepais[e.currentTarget.id].get('title'),
              content: that.data.yuepais[e.currentTarget.id].get('content'),
              cost: that.data.yuepais[e.currentTarget.id].get('cost'),
              unit: that.data.yuepais[e.currentTarget.id].get('unit'),
              photoNum: that.data.yuepais[e.currentTarget.id].get('photoNum'),
              psNum: that.data.yuepais[e.currentTarget.id].get('psNum'),
              imgPaths: that.data.yuepais[e.currentTarget.id].get('images'),
              FilmIndex: that.data.yuepais[e.currentTarget.id].get('film') =='不支持'? 0 : 1,
              customIndex: that.data.yuepais[e.currentTarget.id].get('custom') == '不支持' ? 0 : 1,
              editHidden: !that.data.editHidden,
              selectedId: e.currentTarget.id
            })
          } else if (res.tapIndex == 1) {
            //选择删除信息
            wx.showModal({
              title: '提示',
              content: '是否删除此信息',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  that.data.yuepais[e.currentTarget.id].destroy({
                    success: function (myObject) {
                      // 删除成功
                      var User = Bmob.Object.extend("_User");
                      var query = new Bmob.Query(User);
                      query.get(Bmob.User.current().id, {
                        success: function (result) {
                          var yueNum= result.get('yueNum');
                          result.set("yueNum", yueNum - 1);
                          result.save();
                        },
                      });
                      console.log("信息删除成功")

                      var tempList = that.data.yuepais;
                      var tempDel = that.data.yuepais[e.currentTarget.id];

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
                }
              }
            });
          }
        }
      }
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
  //响应返回事件
  bindBack: function () {
    this.setData({
      editHidden: !this.data.editHidden,
    })
  },

  //,,,,,,,,,,,,,,,,,,,,,,,,,,
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
          var tempList = that.data.imgPaths;
          var tempDel = that.data.imgPaths[e.currentTarget.id];
          that.removeByValue(tempList, tempDel);
          that.setData({
            imgPaths: tempList
          })
        }
      }
    });
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
        var urlArr = new Array();
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

  //监听输入修改
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

    var that= this;

    var yuepai = this.data.yuepais[this.data.selectedId];

    yuepai.set("images", this.data.imgPaths);
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

        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 3000,
          complete: function () {
            that.setData({
              editHidden: !that.data.editHidden
            })
          }
        });
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建失败', error);
        wx.showToast({
          title: '添加失败',
          duration: 3000,
        })
      }
    });
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