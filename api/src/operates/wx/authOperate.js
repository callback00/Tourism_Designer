const https = require('https')
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper')

const request = require('superagent')
const logger = require('../../common/logger')

const Member = require('../../models/memberModel')

module.exports = {
  /**
   * 微信app用户登录
   */
  wxappLogin: (mobile, callback) => {
    Member.findOne({
      where: {
        mobile
      }
    }).then((member) => {
      if (member) {
        callback(null, member)
      } else {

        getMobileInfo(mobile, (err, phoneInfo) => {

          if (err) {
            // 记录错误日志,但不阻止系统运行
            logger.error(`----- authOperate getMobileInfo error = ${err} -----`)
          }

          let province = ''
          let city = ''
          if (phoneInfo) {
            province = phoneInfo.prov
            city = phoneInfo.city ? phoneInfo.city : phoneInfo.prov
          }

          const data = { mobile, province, city, companyId: 1 }
          Member.create(data).then((success) => {
            return callback(null, success)
          }).catch((error) => {
            logger.error(`----- authOperate regist error = ${error} -----`)
            return callback('请求已被服务器拒绝')
          })
        })
      }
    }).catch((error) => {
      logger.error(`----- authOperate wxappLogin error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },
}

function getMobileInfo(mobile, callback) {
  request
    .get('https://api04.aliyun.venuscn.com/mobile')
    .set('Authorization', 'APPCODE 2892cd81f085452ab0bdcf23b1c80cc3')
    .query({
      mobile: mobile
    })
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (res.body.ret === 200) {
        callback(null, res.body.data)
      } else {
        logger.error(`----- authOperate wxappLogin error = ${res.body.msg} -----`)
        callback('系统无法判别手机号区域，请联系管理员。')
      }
    })
}

