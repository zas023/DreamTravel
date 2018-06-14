//获取应用实例
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
var myDate = new Date();
//格式化日期
function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-'
    + month_add + '-'
    + myDate.getDate()
  return formate_result;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice_status: false,
    peopleHide: false,
    isAgree: false,
    date: formate_data(myDate),
    address: '点击选择位置',
    longitude: 0, //经度
    latitude: 0,//纬度
    showTopTips: false,
    TopTips: '',
    noteMaxLen: 200,//备注最多字数
    content: "",
    noteNowLen: 0,//备注当前字数
    types: ["旅拍", "交友", "写真", "外景", "婚纱", "艺术", "古风", "二次元", "其他"],
    typeIndex: "0",
    showTime:false,//显示时间
    imgPaths: [],
    uploadPaths: [],
  },

  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },


  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var myInterval = setInterval(getReturn, 500); ////半秒定时查询
    function getReturn() {
      wx.getStorage({
        key: 'user_openid',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            that.setData({
              loading: true
            })
          }
        }
      })
    }
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

  //限制人数
  switch1Change: function (e) {
    if (e.detail.value == false) {
      this.setData({
        peopleHide: false
      })
    } else if (e.detail.value == true) {
      this.setData({
        peopleHide: true
      })
    }
  },

  //改变时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //改变活动类别
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //选择地点
  addressChange: function (e) {
    this.addressChoose(e);
  },
  addressChoose: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name,
          longitude: res.longitude, //经度
          latitude: res.latitude,//纬度
        })
        if (e.detail && e.detail.value) {
          this.data.address = e.detail.value;
        }
      },
      fail: function (e) {
      },
      complete: function (e) {
      }
    })
  },

  //同意相关条例
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      showInput: !this.data.showInput
    });
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var that = this;

    if (that.data.showInput == false) {
      wx.showModal({
        title: '提示',
        content: '请先阅读《发起须知》'
      })
      return;
    }
    var title = e.detail.value.title;
    var endtime = this.data.date;
    var typeIndex = this.data.typeIndex;
    var acttype = 1 + parseInt(typeIndex);
    var address = this.data.address;
    var longitude = this.data.longitude; //经度
    var latitude = this.data.latitude;//纬度
    var price = e.detail.value.price;
    var photonum = e.detail.value.photoNum;
    var psnum = e.detail.value.psNum;
    var switchfilm = e.detail.value.switchfilm;
    var switchcustom = e.detail.value.switchCustom;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入主题'
      });
    } else if (address == '点击选择位置') {
      this.setData({
        showTopTips: true,
        TopTips: '请选择地点'
      });
    } else if (price == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入价格'
      });
    } else if (photonum == '') {
      this.setData({
        showTopTips: true,
        TopTips: '请输入底片数量'
      });
    } else if (psnum == '') {
      this.setData({
        showTopTips: true,
        TopTips: '请输入精修数量'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入活动内容'
      });
    } else {
      console.log('校验完毕');
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      //向 YuePai 表中新增一条数据
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var Diary = Bmob.Object.extend("YuePai");
          var diary = new Diary();
          var me = new Bmob.User();
          me.id = ress.data;
          console.log(me)
          diary.set("title", title);
          diary.set("endtime", endtime);
          diary.set("type", acttype + "");
          diary.set("cost", price);
          diary.set("address", address);
          diary.set("longitude", longitude);//经度
          diary.set("latitude", latitude);//纬度
          diary.set("content", content);
          diary.set("user", me);
          diary.set("photoNum", photonum);
          diary.set("psNum", psnum);
          diary.set("likeNum", 0);
          diary.set("commentNum", 0);
          diary.set("viewNum", 0);
          if (switchfilm) {
            diary.set("film", "支持");
          } else {
            diary.set("film", "不支持");
          }
          if (switchcustom) {
            diary.set("custom", "提供");
          } else {
            diary.set("custom", "不提供");
          }
          if (that.data.uploadPaths.length > 0) {
            diary.set("images", that.data.uploadPaths);
          }
          console.log(diary)
          //新增操作
          diary.save(null, {
            success: function (result) {
              console.log("发布成功,objectId:" + result.id);
              that.setData({
                isLoading: false,
                isdisabled: false,
                eventId: result.id,
              })
              //添加成功，返回成功之后的objectId(注意，返回的属性名字是id,而不是objectId)
              common.dataLoading("发起成功", "success", function () {
                //重置表单
                that.setData({
                  title: '',
                  typeIndex: 0,
                  address: '点击选择位置',
                  longitude: 0, //经度
                  latitude: 0,//纬度
                  data: formate_data(myDate),
                  isHide: true,
                  peoplenum: 0,
                  peopleHide: false,
                  isAgree: false,
                  content: "",
                  contactValue: '',
                  noteNowLen: 0,
                })
              });
            },
            error: function (result, error) {
              //添加失败
              console.log(error);
              common.dataLoading("发起失败", "loading");
              that.setData({
                isLoading: false,
                isdisabled: false
              })
            }
          })
        }
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  }
})