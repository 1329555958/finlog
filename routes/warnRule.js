/**
 * Created by baodekang on 2015/10/28.
 */
var express = require('express');
var warnRule = express.Router();
var ResponseResult = require('../service/utils/ResponseResult');

var client = require('../service/client/es');
var ES_CONSTANT = require('../service/utils/EsConstant');
var Page = require('../service/utils/Page');
var WarnRuleModel = require('../service/model/WarnRuleModel');
var _ = require('lodash');
var tools = require('../service/utils/tools');
/**
 * 保存或更新
 */
warnRule.post('/saveOrUpdate', function (req, res) {
    res.set({'Content-Type': 'text/json', 'Encoding': 'utf8'});
    var source = req.body,
        warnRuleModel = new WarnRuleModel(),
        responseResult = new ResponseResult();
    _.extend(warnRuleModel, source);

    tools.UserUtil.addUserIdToDoc(warnRuleModel, tools.UserUtil.getUserIdFromSession(req));
    warnRuleModel.createTime = new Date();
    if (!warnRuleModel.id) {
        client.index({
            index: ES_CONSTANT.INDEX,
            type: ES_CONSTANT.ES_TYPE.WARN_RULE,
            body: warnRuleModel,
            refresh: true
        }, function (err, response) {
            if (err) {
                responseResult.success = false;
                responseResult.message = err.message;
            }
            res.send(responseResult);
        });
    } else {
        client.update({
            index: ES_CONSTANT.INDEX,
            type: ES_CONSTANT.ES_TYPE.WARN_RULE,
            id: warnRuleModel.id,
            body: {
                doc: warnRuleModel
            },
            refresh: true
        }, function (err, response) {
            if (err) {
                responseResult.success = false;
                responseResult.message = err.message;
            }
            res.send(responseResult);
        });
    }
});

/**
 * 删除:id
 */
warnRule.post('/delete', function (req, res) {
    res.set({'Content-Type': 'text/json', 'Encoding': 'utf8'});
    var body = req.body,
        responseResult = new ResponseResult();
    client.delete({
        index: ES_CONSTANT.INDEX,
        type: ES_CONSTANT.ES_TYPE.WARN_RULE,
        id: body.id,
        refresh: true
    }, function (err, response) {
        if (err) {
            responseResult.success = false;
            responseResult.message = err.message;
        }
        res.send(responseResult);
    });

});

/**
 * 查询
 */
warnRule.post('/search', function (req, res) {
    res.set({'Content-Type': 'text/json', 'Encoding': 'utf8'});
    var searchCondition = req.body;
    var page = new Page(searchCondition.currentPage, searchCondition.pageSize);
    var condition = {},
        responseResult = new ResponseResult();
    if (searchCondition.condition) {
        condition.name = searchCondition.condition;
    }
    var userId = tools.UserUtil.getUserIdFromSession(req);
    if (userId) {
        condition[ES_CONSTANT.USER.DOC_KEY] = userId;
    }
    var conditions = tools.makeMustFromCondition(condition);


    var param = {
        index: ES_CONSTANT.INDEX,
        type: ES_CONSTANT.ES_TYPE.WARN_RULE,
        from: page.getRecordStart(),
        sort: 'createTime:desc',
        size: page.pageSize
    };
    if (conditions.length) {
        _.set(param, 'body.query.bool.must', conditions);
    }
    client.search(param, function (error, response) {
        if (error) {
            responseResult.success = false;
            responseResult.message = error.message;
        } else {
            var hits = response.hits.hits;
            var info = [];
            hits.forEach(function (hit) {
                var warnRule = {};
                for (var key in hit._source) {
                    warnRule[key] = hit._source[key];
                }
                warnRule.id = hit._id;
                info.push(warnRule);
            });
            page.records = info;
            page.setTotalRecord(response.hits.total);
            responseResult.info = page;
            res.send(responseResult);
        }
    });
});

module.exports = warnRule;