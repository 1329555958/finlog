/**
 * Created by weichunhe on 2015/10/22.
 */
var express = require('express');
var http = require('http');
var router = express.Router();
var config = require('../config/config');
var client = require('../service/client/es');
var beans = require('../service/utils/beans');
var _ = require('lodash');

//查询数据
router.get('/search', function (req, res) {
    var opts = req.query;
    console.log('es search params:', opts);
    client.es_search(opts, res);
});
//保存数据
router.post(/^\/update\/(.*)$/, function (req, res) {
    var data = req.body, url = req.params[0];
    var opts = {
        host: config.es_host,
        port: config.es_port,
        path: '/' + url,
        method: 'PUT'
    };
    var rqt = http.request(opts, function (rsp) {
        var data = '';
        rsp.on('data', function (body) {
            data += body;
        }).on('end', function () {
            res.json(data);
        })
            .on('error', function (err) {
                throw err;
            });

    }).on('error', function (err) {
        throw  err;
    });
    rqt.write(JSON.stringify(data));

    rqt.end();
});

//java 中的main 方法
if (require.main === module) {
    console.log(querystring.stringify({di: 1, name: 'wch', aa: 2}));
}

module.exports = router;