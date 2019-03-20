const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const TourismLogo = require('../../../models/tourismLogo/tourismLogo_Model')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()


module.exports = {

    getLogoList: async (searchCondition, companyId, callback) => {

        try {
            const data = await TourismLogo.findAll({
                where: {
                    companyId,
                    keyWord: { $like: `%${searchCondition}%` }
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

    getLogoById: async (id, callback) => {

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

    logoCreate: async (data, companyId, callback) => {
        data.companyId = companyId

        try {

            const result = await TourismLogo.create(data).then((result) => {
                return result;
            })

            return callback(null, '创建成功。');

        } catch (error) {
            logger.error(`----- tourismLogoOperate logoCreate first try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }

    },

    logoEdit: async (id, data, callback) => {
        try {
            const result = await TourismLogo.update(
                data,
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- tourismLogoOperate logoEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    //伪删除
    logoDelete: async (id, callback) => {
        try {
            await TourismLogo.destroy({
                where: {
                    id
                }
            })
            return callback(null, '删除成功！');

        } catch (error) {
            logger.error(`----- tourismLogoOperate logoDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    }
}
