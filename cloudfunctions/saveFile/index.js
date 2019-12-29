/**
 * 接收的参数——用户openid、用户当前所处目录的名字、id、绝对路径、文件、时间戳
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const currentUser = wxContext.OPENID;

  /**
   * 文件存至云存储
   * 
   * 
   */
  const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))    // 读取文件流
  // 计算文件md5值
  // 在绝对路径中添加用户openid
  // 修改文件名为md5值（注意保存原本文件名）

  // 存储文件
  return await cloud.uploadFile({
    cloudPath: 'demo.jpg',
    fileContent: fileStream,
  });




  /**
   * 文件信息存至数据库
   * 
   * 
   */
  // 添加文件记录到文件表中
  // 


  // 返回操作完成状态信息
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}