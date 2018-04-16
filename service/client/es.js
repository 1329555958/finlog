/**
 * Created by weichunhe on 2015/10/22.
 */
var elasticsearch = require('elasticsearch');
var config = require('../../config/config');
var beans = require('../utils/beans');
var log = require('../log/log4js');
var _ = require('lodash');
var util = require('util');
var client = new elasticsearch.Client({
    host: config.es_url
    //log: 'trace'
});

//es 查询方法
client.es_search = function (opts, res, succCallback) {
    client.search(opts || {}).then(function (body) {
        console.log('es search result:', util.inspect(body, {depth: 1})); //打印简单的结果信息
        succCallback ? succCallback(body.hits,body) : res.json(body.hits);
    }, function (error) {
        log.error('es serach error:', error);
        res.status(500).json(beans.newErr(error.status, error.message));
    });
};

module.exports = client;