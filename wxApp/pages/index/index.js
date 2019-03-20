const tools = require('../../utils/tools')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],

    loginBtnShow: true,

    swiperImg: [
      'https://dimg08.c-ctrip.com/images/tg/772/950/815/e0b38db9fe7a423ca99a8617cd060afb_R_228_10000.jpg',
      'https://dimg08.c-ctrip.com/images/100c0t000000is3zw9EA2_R_228_10000.jpg',
    ],
    indicatorDots: true, //	是否显示面板指示点
    autoPlay: true, //是否自动切换
    circular: true, //是否采用衔接滑动
    vertical: false, //滑动方向是否为纵向
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长

    files: [],
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    const userInfoStr = wx.getStorageSync('userInfo');

    if (userInfoStr) {
      this.setData({
        loginBtnShow: false
      })
    }
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  searchTap: function () {
    const inputVal = this.data.inputVal
    if (inputVal) {
      wx.navigateTo({
        url: `../search/index?condition=${inputVal}`
      })
    }
  },

  clearInput: function () {
    this.setData({
      inputVal: "",
      searchResult: []
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  loginHandle: function (e) {
    wx.navigateTo({
      url: '../login/index'
    })
  },

  img_search: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          res.tempFilePaths.forEach(function (val) {
            const fileTmp = {
              path: val,
              isUpload: false,
              tips: 0
            }

            // 方便修改数据
            that.setData({
              files: that.data.files.concat(fileTmp)
            });
          })
        }

        if (that.data.files.length > 0) {
          // 遍历that.data.files 方便修改数据，如果遍历res.tempFilePaths 就不好修改url了
          that.data.files.forEach(function (val, index) {
            var imageSrc = val.path;

            if (!val.isUpload || val.tips === 1) {
              that.data.files[index].tips = 1, //上传中
                that.setData({
                  files: that.data.files
                });
                tools.uploadFile('/wxapp/tourismLogo/imgSearch', imageSrc, 'image', (result) => {
                if (result.data.error) {
                  that.data.files[index].tips = 3 //上传失败
                  that.data.files[index].isUpload = true
                  that.setData({
                    files: that.data.files
                  });
                } else {
                  that.data.files[index].tips = 2 // 上传成功
                  that.data.files[index].isUpload = true
                  that.data.files[index].path = JSON.parse(result.data).success
                  that.setData({
                    files: that.data.files
                  });
                }
              })
            }
          })
        }
      }
    })
  }
});