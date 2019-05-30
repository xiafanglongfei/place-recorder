// miniprogram/pages/about/about.js

const app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // about: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: app.globalData.openid
    })
    // this.data.openid = app.globalData.openid

    // var article = '<div>我是HTML代码</div>';
    // var article = readFile("about.md");
    wx.cloud.downloadFile({
        fileID: 'cloud://test-wajhw.7465-test-wajhw/about.md',
        config: {
          env: "test-wajhw"
        }
      }).then(res => {
        // get temp file path
        console.log(res.tempFilePath)
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePath,
          encoding: 'utf-8',
          success: res => {
            console.log("readFile res: ", res)
            var article = res.data
            /**
             * WxParse.wxParse(bindName , type, data, target,imagePadding)
             * 1.bindName绑定的数据名(必填)
             * 2.type可以为html或者md(必填)
             * 3.data为传入的具体数据(必填)
             * 4.target为Page对象,一般为this(必填)
             * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
             */
            var that = this;
            WxParse.wxParse('article', 'md', article, that, 5);
          },
          fail: error => {
            console.error(error)
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})