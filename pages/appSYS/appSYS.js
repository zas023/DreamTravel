// appSYS.js
var Bmob = require('../../utils/bmob.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPhone: '',
    userQQ: '',
    idNumber: '',
    userCity: '',
    workLife: ["1-3年", "3-5年", "5-8年", "8年以上"],
    workLifeIndex: 0,
    range: ["业余摄影师", "专业摄影师", "高级摄影师"],
    rangeIndex: 0,
    idCardImg: '../../images/idcard_example.jpg',
    userCamera: '',
    userLens: '',
    userStyle: '',
    selfIntroduction: '',

    buttonLoading: false,
  },
  //监听输入
  bindNameInput: function (e) {
    this.data.userName = e.detail.value;
  },
  bindPhoneInput: function (e) {
    this.data.userPhone = e.detail.value;
  },
  bindQQInput: function (e) {
    this.data.userQQ = e.detail.value;
  },
  bindIDNumberInput: function (e) {
    this.data.idNumber = e.detail.value;
  },
  bindWorkLifeChange: function (e) {
    this.data.workLifeIndex = e.detail.value;
  },
  binduserCityTap: function (e) {
    // this.data.userCity = e.detail.value;
    wx.navigateTo({
      url: '../selectCity/selectCity',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindRangeChange: function (e) {
    this.data.rangeIndex = e.detail.value;
  },
  bindCameraInput: function (e) {
    this.data.userCamera = e.detail.value;
  },
  bindLensInput: function (e) {
    this.data.userLens = e.detail.value;
  },
  bindStyleInput: function (e) {
    this.data.userStyle = e.detail.value;
  },
  inputIntroduction: function (e) {
    this.data.selfIntroduction = e.detail.value;
  },

  //监听选择相册
  chooseImage: function (e) {
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
              idCardImg: res.url(),
            })
            console.log(that.data.imgUrl);
          }, function (error) {
            console.log(error);
          })
        }
      }
    });
  },
  //监听上传按钮
  bindSubmit: function (e) {
    //验证是否填写完善必要信息
    if (this.data.userName == '' || this.data.userPhone == '' || this.data.userQQ == '' || this.data.idNumber == ''
      || this.data.userCity == '' || this.data.userCamera == '' || this.data.userLens == '' || this.data.userStyle == '') {
      wx.showModal({
        title: '提示',
        content: '请填写必要信息',
        showCancel: false
      });
      return;
    }

    if (this.data.idCardImg == '../../images/idcard_example.jpg'){
      wx.showModal({
        title: '提示',
        content: '请上传手持证件照',
        showCancel: false
      });
      return;
    }

    var that = this;
    this.setData({
      buttonLoading: true
    })
    var currentUser = Bmob.User.current();

    var Apply = Bmob.Object.extend("Apply");
    var apply = new Apply();
    apply.set("appUser", currentUser);
    apply.set("userName", this.data.userName);
    apply.set("userPhone", this.data.userPhone);
    apply.set("userQQ", this.data.userQQ);
    apply.set("idNumber", this.data.idNumber);
    apply.set("userCity", this.data.userCity);
    apply.set("workLife", this.data.workLife[this.data.workLifeIndex]);
    apply.set("range", this.data.range[this.data.rangeIndex]);
    apply.set("idCardImg", this.data.idCardImg);
    apply.set("userCamera", this.data.userCamera);
    apply.set("userLens", this.data.userLens);
    apply.set("userStyle", this.data.userStyle);
    apply.set("selfIntroduction", this.data.selfIntroduction);
    //添加数据，第一个入口参数是null
    apply.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId
        that.setData({
          buttonLoading: false
        });
        wx.showToast({
          title: '申请提交成功',
          icon: 'success',
          duration: 3000
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建失败');
        wx.showToast({
          title: '申请提交失败',
          icon: 'fail',
          duration: 3000
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})