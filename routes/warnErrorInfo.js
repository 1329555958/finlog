/**
 * Created by baodekang on 2015/11/23.
 */
var express = require('express');
var warnErrorInfo = express.Router();
var client = require('../service/client/es');
var ES_CONSTANT = require('../service/utils/EsConstant');
var Page = require('../service/utils/Page');
var ResponseResult = require('../service/utils/ResponseResult');
var _ = require('lodash');
var moment = require('moment');
var tools = require('../service/utils/tools');

/**
 * 查询
 */
warnErrorInfo.post('/search', function (req, res) {
    res.set({'Content-Type': 'text/json', 'Encoding': 'utf8'});
    var searchCondition = req.body;
    var page = new Page(searchCondition.currentPage, searchCondition.pageSize),
        responseResult = new ResponseResult();
    var query = {};
    query.bool = {};
    query.bool.must = [];
    var condition = {};
    if (searchCondition.name) {
        condition.warnRuleName = searchCondition.name;
    }
    var userId = tools.UserUtil.getUserIdFromSession(req);
    if (userId) {
        condition[ES_CONSTANT.USER.DOC_KEY] = userId;
    }
    query.bool.must = query.bool.must.concat(tools.makeMustFromCondition(condition));

    var startDate = searchCondition.startDate,
        endDate = searchCondition.endDate;
    if (startDate || endDate) {
        var range = {};
        range['createTime'] = {};
        if (startDate) {
            range['createTime']['gte'] = moment(startDate).valueOf();
        }
        if (endDate) {
            range["createTime"]['lte'] = moment(endDate).valueOf();
        }
        query.bool.must.push({"range": range});
    }

    var param = {
        index: ES_CONSTANT.INDEX,
        type: ES_CONSTANT.ES_TYPE.WARN_ERROR_INFO,
        body: {
            query: query
        },
        sort: 'createTime:desc',
        from: page.getRecordStart(),
        size: page.pageSize
    };
    client.search(param, function (error, response) {
        if (error) {
            responseResult.success = false;
            responseResult.message = error.message;
        } else {
            var hits = response.hits.hits;
            var info = [];
            hits.forEach(function (hit) {
                var warnErrorInfo = {};
                for (var key in hit._source) {
                    var value = hit._source[key];
                    if (key == 'createTime') {
                        value = moment(value).format('YYYY-MM-DD HH:mm:ss');
                    }
                    warnErrorInfo[key] = value;
                }
                warnErrorInfo.id = hit._id;
                info.push(warnErrorInfo);
            });
            page.records = info;
            page.setTotalRecord(response.hits.total);
            responseResult.info = page;
            res.send(responseResult);
        }
    });
});

module.exports = warnErrorInfo;