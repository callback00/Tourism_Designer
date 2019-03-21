const tourismLogoOperate = require('../../../operates/wx/tourismLogo/tourismLogoOperate')
const fs = require("fs")
const request = require('superagent')
const redisUtility = require('../../../common/redisUtility')

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
        const companyId = req.member.companyId;

        if (!req.files || !req.files.image) {
            return res.status(200).json({ error: '请选择需要上传的文件!' })
        }

        const imagePath = req.files.image.path

        redisUtility.getCache('baiduApi', 'token', (redis_success) => {
            // 命中缓存，直接返回缓存内容
            let token = ''
            if (redis_success) {
                token = redis_success
            } else {
                token = '24.c8cb03d1b35f3b7c177c4e5409461e44.2592000.1555662292.282335-15779945' //第一次没有token，用postman获取token赋值
            }

            invokeBaiduApi(imagePath, (api_error, wordArry) => {
                if (api_error) {
                    res.send({ "errMsg": api_error });
                } else {
                    tourismLogoOperate.imgSearch(wordArry, companyId, (error, success) => {
                        if (error) {
                            return res.send({ "errMsg": error });
                        } else {
                            return res.status(200).json({ success });
                        }
                    })
                }
            }, token)
        })
    },
}

// 调用百度识别文字api
function invokeBaiduApi(imagePath, callback, token) {
    fs.readFile(imagePath, function (err, data) {
        if (err) {
            return callback('图片上传失败')
        }
        const base64str = new Buffer(data).toString('base64'); //图片转字节

        request
            .post(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic`)
            .query({ access_token: token })
            .send({ image: base64str })
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((baidu_err, baidu_res) => {
                if (baidu_err) {
                    return callback(baidu_err)
                }

                if (baidu_res.body !== undefined) {
                    if (baidu_res.body.error_code === 110) {
                        request
                            .post(`https://aip.baidubce.com/oauth/2.0/token`)
                            .query({ grant_type: 'client_credentials', client_id: 'KlTt7e5KokjcX3baVk6pmM4k', client_secret: 'NaRvDqOmgkK3MCRcyDQrf2FWX1nBOgMd' })
                            .end((baidu_token_err, baidu_token_res) => {
                                if (baidu_token_err) {
                                    return callback('获取apiToken出错，请联系管理员')
                                } else {
                                    redisUtility.setCache('baiduApi', 'token', baidu_token_res.body.access_token)
                                    token = invokeBaiduApi(imagePath, callback, baidu_token_res.body.access_token)
                                }
                            })
                    } else {
                        const wordArry = baidu_res.body.words_result

                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath)
                        }

                        if (baidu_res.body.error_code) {
                            callback(baidu_res.body.error_msg)
                        } else {
                            if (wordArry.length > 0) {
                                callback(null, wordArry)
                            } else {
                                callback(null, [])
                            }
                        }
                    }
                }

            })
    });
}
