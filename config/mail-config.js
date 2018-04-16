/**
 * Created by baodekang on 2015/11/5.
 */
var path = require('path');
var config = {};
//--------------------------------------------配置信息 start----------------------------------------------

config.host = 'smtp.exmail.qq.com';
config.port = 465;
config.username = 'finapm_alert@netfinworks.com';
config.password = '$RFVnhy6';
config.from = 'finapm_alert@netfinworks.com';


//home page
config.home_page = path.join(__dirname, '..', 'public', 'views', 'home.html');

//--------------------------------------------配置信息 end----------------------------------------------
module.exports = config;
