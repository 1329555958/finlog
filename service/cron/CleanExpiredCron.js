/**
 * Created by weichunhe on 2016/11/2.
 */
var CronJob = require('cron').CronJob;
var client = require('../client/es');
var constant = require('../utils/EsConstant');
var _ = require('lodash');
var config = require('../../config/config');
var http = require('http');

var RETAIN_DAYS = 7; //保存几天的数据
var CRON = "0 0 23 * * *";//每天23点整
//curl -XDELETE 'http://10.65.215.34:9201/logstash-*'
function deleteIndex(index) {
    console.log("to delete " + index);
    var opts = {
        host: config.es_host,
        port: config.es_port,
        path: "/" + index,
        method: 'DELETE'
    };
    var rqt = http.request(opts, function (rsp) {
        var data = '';
        rsp.on('data', function (body) {
            data += body;
        }).on('end', function () {
            console.log("delete end:" + data);
        }).on('error', function (err) {
            console.error("delete failed :" + index + ":" + err);
        });

    }).on('error', function (err) {
        console.error("delete failed :" + index + ":" + err);
    });
    rqt.end();
}

module.exports = function () {
    this.addJob = function () {
        new CronJob(CRON, this.onTick, undefined, true, 'Asia/Shanghai');
    };
    this.onTick = function () {
        //console.log("start cron");
        client.indices.getMapping({
            ignoreUnavailable: true,
            allowNoIndices: false,
            index: constant.LOG_INDEX
        }, function (err, body) {
            //body = {
            //    "logstash-2016-10-31": 0,
            //    "logstash-2016-10-30": 0,
            //    "logstash-2016-10-29": 0,
            //    "logstash-2016-10-28": 0,
            //    "logstash-2016-10-27": 0,
            //    "logstash-2016-10-26": 0,
            //    "logstash-2016-11-01": 0,
            //    "logstash-2016-11-02": 0
            //};
            //all index
            var indices = _.keys(body).sort().reverse();
            console.info(indices);
            // expired index
            if (indices.length > RETAIN_DAYS) {
                var expireds = indices.slice(RETAIN_DAYS);
                console.info(expireds);
                _.each(expireds, function (index) {
                    deleteIndex(index);
                });
            }
        });
    };

};