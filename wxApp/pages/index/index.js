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
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    const userInfoStr = wx.getStorageSync('userInfo');

    if (userInfoStr) {
      this.setData({
        loginBtnShow: false,
        inputVal: ''
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
    const that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        if (res.tempFilePaths.length > 0) {

          wx.navigateTo({
            url: `../search/index?imagePath=${res.tempFilePaths[0]}`
          })
        }
      }
    })
  }
});