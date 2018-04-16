/**
 * Created by baodekang on 2015/10/28.
 */
var express = require('express');
var mail = express.Router();
var MailUtil = require('../service/utils/MailUtil');
var _ = require('lodash');
/**
 * 保存或更新
 */
mail.post('/sendMail', function (req, res) {
    var params = req.body;
    var info = {
        to     : params.tos,
        subject: '【日志警告】警告触发-' + params.subject,
        html   : params.content
    };
    MailUtil.sendMail(info);
    res.send({'ret': '邮件发送成功！'});
});

mail.post('/beforeSendMail', function (req, res) {
    console.log('邮件发送前！');
    res.send({'ret': '邮件发送前调用成功！'})
});

mail.post('/afterSendMail', function (req, res) {
    console.log('邮件发送后！');
    res.send({'ret': '邮件发送后调用成功！'})
});



module.exports = mail;