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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      inputVal: options.condition
    })
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
    this.searchTap();
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

    if (inputVal && inputVal.length > 0) {
      // 调用api获取数据
      tools.post('/wxapp/tourismLogo/getLogoList', (error, success) => {

        if (error) {

          wx.showModal({
            title: '错误提示',
            content: error,
            showCancel: false
          })
        } else {

          this.setData({
            searchResult: success
          })
        }
      }, { queryCondition: inputVal }, true)
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
  }
})