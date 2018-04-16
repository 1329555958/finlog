/**
 * Created by weichunhe on 2015/10/21.
 */
var path = require('path');
var os = require('os');
var fs = require('fs');
var _ = require('lodash');
var config = {};
//--------------------------------------------配置信息 start----------------------------------------------

//启动端口
config.port = 3000;

//日志文件 目录
config.log_path = path.join(os.platform() === "linux" ? "/opt" : "D:", "logs", "finlog");

//---------------------------------es 环境配置------------------------------------
config.es_host = '47.100.130.115';
config.es_port = '9300';
config.es_url = 'http://' + config.es_host + ':' + config.es_port;

//----------------------------是否需要登录------------------------
config.need_login = false;
//guardian 配置
var guardian = config.guardian = {};
//-----------------------guardian 环境配置-------------------------------------------
guardian.base_url = 'http://func48admin.vfinance.cn/guardian';
guardian.session_url = 'http://func48intra.vfinance.cn/guardian-api/session';

//当前web页面的访问地址
//guardian.return_url = 'http://10.5.16.5:3000/';
guardian.return_url = 'http://10.65.215.35:3000/';

guardian.login_url = guardian.base_url + '/login?sysCode=finlog-web';
guardian.logout_url = guardian.base_url + '/logout';
guardian.cookie_key = '_NETFINWORKSGUARDIAN_';

//--------------------------------------------配置信息 end-------------------------------------------------

//home page
config.home_page = path.join(__dirname, '..', 'public', 'views', 'home.html');
//是否debug模式
config.is_debug = isDebug();

//是否debug 模式
function isDebug() {
    var args = process.execArgv;
    return _.find(args, function (a) {
            return _.startsWith(a, '--debug')
        }) !== undefined;
}


//判断日志目录是否存在
if (!fs.existsSync(config.log_path)) {
    var dirs = config.log_path.split(/\\|\//);
    for (var i = 1; i <= dirs.length; i++) {
        var tmp_path = dirs.slice(0, i).join(path.sep);
        if (tmp_path && !fs.existsSync(tmp_path)) {
            fs.mkdirSync(tmp_path);
        }
    }
}
module.exports = config;