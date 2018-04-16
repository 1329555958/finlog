/**
 * 邮件util
 * @type {exports|module.exports}
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../config/mail-config');

var transporter = nodemailer.createTransport(smtpTransport({
    host: config.host,
    port: config.port,
    auth: {
        user: config.username,
        pass: config.password
    },
    secure: true
}));

exports.sendMail = function(info){
    transporter.sendMail({
        from: config.from,
        to: info.to,
        subject: info.subject,
        html: info.html
    }, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent');
        }
    });
}

