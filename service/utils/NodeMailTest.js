var MailUtil = require('../utils/MailUtil');

var to = 'sb_xiaobao@sina.com';
var subject = 'hello world!';
var text = 'hello world!';
var info = {
    to: 'sb_xiaobao@sina.com',
    subject: 'hello world!',
    text: 'sb_xiaobao@sina.com'
}
MailUtil.sendMail(info);