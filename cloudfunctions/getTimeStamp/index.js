// 云函数入口文件
// @warning 本文件并非属于本工程
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  
  console.log("date: ", event.date)

  var d = new Date(event.date)
  // var date = new Date("2018-9-21 14:58:43")

  console.log("d: ", d)
  console.log("d.getTime: ", d.getTime())

  var time_stamp = d.getTime() / 1000

  return {
    time_stamp: time_stamp
  }
}