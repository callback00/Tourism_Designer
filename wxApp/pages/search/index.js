const tools = require('../../utils/tools')
// pages/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    isShowNoDataStr: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      inputVal: options.condition ? options.condition : null,
      imagePath: options.imagePath ? options.imagePath : null
    })

    const inputVal = options.condition ? options.condition : null
    const imagePath = options.imagePath ? options.imagePath : null
    if (inputVal && inputVal.length > 0) {
      this.searchTap();
    } else if (imagePath && imagePath.length > 0) {
      this.imgSearchApi(imagePath)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  searchTap: function () {
    const inputVal = this.data.inputVal
    this.setData({
      isShowNoDataStr: false
    })
    wx.showLoading({
      mask: true,
      title: '查询中',
    })
    if (inputVal && inputVal.length > 0) {
      // 调用api获取数据
      tools.post('/wxapp/tourismLogo/getLogoList', (error, success) => {
        wx.hideLoading()
        if (error) {

          wx.showModal({
            title: '错误提示',
            content: error,
            showCancel: false
          })
          this.setData({
            isShowNoDataStr: true
          })
        } else {

          this.setData({
            searchResult: success,
            isShowNoDataStr: true
          })
        }
      }, { queryCondition: inputVal }, true)
    }
  },

  imgSearchApi: function (imagePath) {
    wx.showLoading({
      mask: true,
      title: '查询中',
    })
    this.setData({
      isShowNoDataStr: false
    })
    tools.uploadFile('/wxapp/tourismLogo/imgSearch', imagePath, 'image', (error, success) => {
      wx.hideLoading()
      if (error) {
        wx.showModal({
          title: '检索失败',
          content: error,
          showCancel: false,
        })
        this.setData({ inputVal: '', isShowNoDataStr: true })
      } else {
        this.setData({ searchResult: success, inputVal: '', isShowNoDataStr: true })
      }
    })
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

  img_search: function (e) {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        if (res.tempFilePaths.length > 0) {
          that.imgSearchApi(res.tempFilePaths[0])
        }
      }
    })
  }
})