const { trim } = require('lodash')
const tourismLogoOperate = require('../../../operates/wx/tourismLogo/tourismLogoOperate')
const fs = require("fs")
const request = require('superagent')
const urlencode = require('urlencode')

var https = require('https')
var qs = require('querystring')

module.exports = {

    getLogoList: (req, res) => {
        const queryCondition = req.body.queryCondition;
        const companyId = req.member.companyId;
        const currentMember = req.member;
        tourismLogoOperate.getLogoList(queryCondition, companyId, (error, success) => {
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
        const companyId = req.member.companyId;
        const currentMember = req.member;
        tourismLogoOperate.getLogoById(id, currentMember, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                success.keyWord = JSON.parse(success.keyWord)
                res.status(200).json({ success });
            }
        })
    },

    imgSearch: (req, res) => {
        res.type = 'json'

        if (!req.files || !req.files.image) {
            return res.status(200).json({ error: '请选择需要上传的文件!' })
        }

        fs.readFile(req.files.image.path, function (err, data) {
            if (err) {
                res.send({ "errMsg": "'图片上传失败'" });
                return;
            }
            const base64str = new Buffer(data).toString('base64'); //图片转字节

            request
                .post(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic`)
                .query({ access_token: '24.c8cb03d1b35f3b7c177c4e5409461e44.2592000.1555662292.282335-15779945' })
                .send({ image: base64str })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((baidu_err, baidu_res) => {

                    if (baidu_err) {
                        return res.status(200).json({
                            success: false,
                            error: baidu_err
                        })
                    }

                    if (baidu_res.body !== undefined || baidu_res.body !== []) {
                        console.log(111)
                    }
                })
        });
    },
}
