const { trim } = require('lodash')
const tourismLogoOperate = require('../../../operates/manage/tourismLogo/tourismLogoOperate')

module.exports = {

    getLogoList: (req, res) => {
        const companyId = req.user.company.id;
        const searchCondition = trim(req.body.searchCondition)
        tourismLogoOperate.getLogoList(searchCondition,companyId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getLogoById: (req, res) => {
        const id = req.body.id
        tourismLogoOperate.getLogoById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                success.keyWord = JSON.parse(success.keyWord)
                res.status(200).json({ success });
            }
        })
    },

    logoCreate: (req, res) => {
        const data = req.body.data;
        const companyId = req.user.company.id;

        data.keyWord = JSON.stringify(data.keyWord)

        res.type = 'json';
        tourismLogoOperate.logoCreate(data, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    logoEdit: (req, res) => {
        const data = req.body.data;
        const id = req.body.id
        data.keyWord = JSON.stringify(data.keyWord)
        res.type = 'json';
        tourismLogoOperate.logoEdit(id, data, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    logoDelete: (req, res) => {
        const id = req.body.id;

        res.type = 'json'
        tourismLogoOperate.logoDelete(id, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
