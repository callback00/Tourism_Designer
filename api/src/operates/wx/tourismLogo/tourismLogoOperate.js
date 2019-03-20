const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const TourismLogo = require('../../../models/tourismLogo/tourismLogo_Model')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()


module.exports = {

    getLogoList: async (queryCondition, companyId, callback) => {

        try {
            const data = await TourismLogo.findAll({
                where: {
                    companyId,
                    keyWord: { $like: '%' + queryCondition + '%' }
                }
            }).then((list) => {
                return list;
            });

            return callback(null, data);
        } catch (error) {
            logger.error(`----- tourismLogoOperate getLogoList error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    getLogoById: async (id, currentMember, callback) => {

        try {
            const data = await TourismLogo.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, data);
        } catch (error) {
            logger.error(`----- tourismLogoOperate getLogoById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },
}
