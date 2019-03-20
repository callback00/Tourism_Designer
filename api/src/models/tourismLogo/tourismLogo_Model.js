const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

// 该数据库表与 sys_notice_detail 无主外键关系，该表主要是用于建立消息模板，而 sys_notice_detail 则是记录所有消息的表，包括模板消息和自定义的消息
const TourismLogo = conn.define('tourismlogo', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    logoName: { type: sequelize.STRING, allowNull: false, comment: '设计图名称' },
    remark: { type: sequelize.TEXT, allowNull: true, comment: '设计图正文描述' },
    keyWord: { type: sequelize.TEXT, allowNull: true, comment: '搜索关键字' },
    logoImageUrl: { type: sequelize.STRING, allowNull: true, comment: '标准图片地址' },
    schemeUrl: { type: sequelize.STRING, allowNull: true, comment: '设计图地址' },
    amount: { type: sequelize.DECIMAL(9, 2), defaultValue: 0.00, comment: '矢量图下载金额' },
    companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
}, {
        paranoid: true
    })

module.exports = TourismLogo
