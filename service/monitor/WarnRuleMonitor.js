/**
 * Created by baodekang on 2015/11/3.
 */
var client = require('../client/es');
var ES_CONSTANT = require('../utils/EsConstant');
var moment = require('moment');
var MailUtil = require('../utils/MailUtil');
var _ = require('lodash');
var WarnErrorInfo = require('../model/WarnErrorInfo');
var tools = require('../utils/tools');
module.exports = function (warnRule) {

    return {
        userId: warnRule[ES_CONSTANT.USER.DOC_KEY],
        warnRule: warnRule,

        /**
         * 根据id查询log条件
         */
        searchLogQryById: function (callback) {
            client.search({
                index: ES_CONSTANT.INDEX,
                type: ES_CONSTANT.ES_TYPE.LOG_QRY,
                body: {
                    query: {
                        term: {
                            _id: warnRule.queryField
                        }
                    }
                }
            }, function (err, response) {
                if (err) {
                    console.error(err);
                } else {
                    var hits = response.hits.hits;
                    var condition = {};
                    if (hits.length > 0) {
                        condition = hits[0]._source.condition;
                    }else{ //不存在对应的查询，置为无效
                        console.error("此告警对应的查询不存在,"+JSON.stringify(warnRule));
                        warnRule.disabled = true;
                        warnRule.description = warnRule.description + '(不存在对应的查询,已无效!)';
                        warnRule.createTime = new Date();
                        client.update({
                            index: ES_CONSTANT.INDEX,
                            type: ES_CONSTANT.ES_TYPE.WARN_RULE,
                            id: warnRule.id,
                            body: {
                                doc: warnRule
                            },
                            refresh: true
                        }, function (err, response) {

                        });
                        return;
                    }
                    if (_.isFunction(callback)) {
                        callback.call(this, condition);
                    }
                }
            });
        },

        /**
         * 告警类型：日志数
         */
        logNumber: function (callback) {
            var _this = this;
            _this.searchLogQryById(function (condition) {
                var index = 'logstash-' + moment().format(ES_CONSTANT.INDEX_FORMAT),
                    endTime = moment().valueOf(),
                    startTime = moment().add(-1 * warnRule.minutes, 'minutes').valueOf(),
                    query = {};
                _.set(query, 'bool.must', []);
                query.bool.must.push({range: {'@timestamp': {'gte': startTime, 'lte': endTime}}});
                if (condition) {
                    query.bool.must = query.bool.must.concat(tools.makeMustFromCondition(condition));
                }

                client.count({
                    index: index,
                    body: {
                        query: query
                    }
                }, function (err, response) {
                    if (err) {
                        console.error(err);
                    } else {
                        if (_.isFunction(callback)) {
                            callback.call(_this, response.count);
                        }
                    }
                });
            });
        },

        /**
         * 告警类型：字段统计
         */
        fieldCount: function (callback) {
            var _this = this;
            _this.searchLogQryById(function (condition) {
                var index = 'logstash-' + moment().format(ES_CONSTANT.INDEX_FORMAT),
                    dimension = warnRule.dimension,
                    endTime = moment().valueOf(),
                    startTime = moment().add(-1 * warnRule.minutes, 'minutes').valueOf(),
                    query = {};
                _.set(query, 'bool.must', []);
                query.bool.must.push({range: {'@timestamp': {'gte': startTime, 'lte': endTime}}});
                if (condition) {
                    query.bool.must = query.bool.must.concat(tools.makeMustFromCondition(condition));
                }

                /**
                 * 非重复数
                 */
                if (dimension == '1') {
                    client.search({
                        index: index,
                        body: {
                            query: query,
                            aggregations: {
                                aggs: {
                                    cardinality: {
                                        field: tools.getSortFieldName(warnRule.fieldName)
                                    }
                                }
                            }
                        }
                    }, function (err, response) {
                        if (err) {
                            console.error(err);
                        } else {
                            if (_.isFunction(callback)) {
                                callback.call(_this, response.aggregations.aggs.value);
                            }
                        }
                    });
                }
                /**
                 * 总数
                 */
                else if (dimension == '2') {
                    client.search({
                        index: index,
                        body: {
                            query: query,
                            aggregations: {
                                aggs: {
                                    terms: {
                                        field: tools.getSortFieldName(warnRule.fieldName),
                                        size: 0
                                    }
                                }
                            }
                        }
                    }, function (err, response) {
                        if (err) {
                            console.error(err);
                        } else {
                            if (_.isFunction(callback)) {
                                callback.call(_this, response.hits.total);
                            }
                        }
                    });
                } else {
                    console.error('dimension not exists:' + dimension);
                }
            });
        },

        process: function (count) {
            var comSymbol = warnRule.comSymbol,
                peckValue = warnRule.peakValue;
            //3.检查：实际值与预估对比
            switch (comSymbol) {
                case 'gt':
                    if (count > peckValue) {
                        this.processError(count, '大于');
                    } else {
                        this.proessSuccess('大于');
                    }
                    break;
                case 'lt':
                    if (count < peckValue) {
                        this.processError(count, '小于');
                    } else {
                        this.proessSuccess('小于');
                    }
                    break;
                case 'gte':
                    if (count >= peckValue) {
                        this.processError(count, '大于等于');
                    } else {
                        this.proessSuccess('大于等于');
                    }
                    break;
                case 'lte':
                    if (count <= peckValue) {
                        this.processError(count, '小于等于');
                    } else {
                        this.proessSuccess('小于等于');
                    }
                    break;
            }
        },

        /**
         * 错误处理
         */
        processError: function (actualValue, comSymbolStr) {
            //cancel warning
            if (!warnRule.warning) {
                return;
            }
            //status == false
            if (!warnRule.status) {
                return;
            }
            var html = '尊敬的用户,您好:<br/>&nbsp;&nbsp;&nbsp;&nbsp;您设置的日志告警:"<b>' + warnRule.name + '</b>",在' + moment().format('YYYY-MM-DD HH:mm:ss') + '触发了告警.<br/>&nbsp;&nbsp;&nbsp;&nbsp;监控条件为:',
                type = warnRule.type;
            if (type == '1') {
                html += '日志数在' + warnRule.minutes + '分钟内' + comSymbolStr + warnRule.peakValue;
            } else if (type == '2') {
                html += warnRule.fieldName + '在' + warnRule.minutes + '分钟内,' + (warnRule.dimension == '1' ? '非重复数' : '总数') + comSymbolStr + warnRule.peakValue;
            }
            html += ',实际值为' + actualValue + ';';
            var info = {
                to: warnRule.email,
                subject: '【触发告警】-' + warnRule.name,
                html: html
            }
            //1.send mail(告警邮件)
            MailUtil.sendMail(info);
            //2.update WarnRule(status, lastTime)
            warnRule.status = false;
            warnRule.lastTime = moment().format('YYYY-MM-DD HH:mm:ss');
            this.updateWarnRule(warnRule);
            this.saveWarnErrorInfo(actualValue, comSymbolStr);
        },

        saveWarnErrorInfo: function (actualValue, comSymbolStr) {
            var errorInfo = new WarnErrorInfo(),
                rule = "";
            errorInfo.warnRuleId = warnRule.id;
            errorInfo.warnRuleName = warnRule.name;
            errorInfo.warnRuleDescription = warnRule.description;
            errorInfo.autualValue = actualValue;
            errorInfo.createTime = new Date();
            if (warnRule.type == '1') {
                rule += '日志数在' + warnRule.minutes + '分钟内' + comSymbolStr + warnRule.peakValue;
            } else if (warnRule.type == '2') {
                rule += warnRule.fieldName + '在' + warnRule.minutes + '分钟内,' + (warnRule.dimension == '1' ? '非重复数' : '总数') + comSymbolStr + warnRule.peakValue;
            }
            errorInfo.rule = rule;

            tools.UserUtil.addUserIdToDoc(errorInfo, this.userId);
            client.index({
                index: ES_CONSTANT.INDEX,
                type: ES_CONSTANT.ES_TYPE.WARN_ERROR_INFO,
                body: errorInfo,
                refresh: true
            }, function (err, response) {
                if (err) {
                    console.error('failed to save warn error info!');
                }
            });
        },

        proessSuccess: function (comSymbolStr) {
            //cancel warning
            if (!warnRule.warning) {
                return;
            }
            //status == true
            if (warnRule.status) {
                return;
            }
            var html = '尊敬的用户,您好:<br/>&nbsp;&nbsp;&nbsp;&nbsp;您设置的日志告警:"<b>' + warnRule.name + '</b>",在' + moment().format('YYYY-MM-DD HH:mm:ss') + '恢复正常.<br/>&nbsp;&nbsp;&nbsp;&nbsp;监控条件为:',
                type = warnRule.type;

            if (type == '1') {
                html = html + '日志数在' + warnRule.minutes + '分钟内' + comSymbolStr + warnRule.peakValue;
            } else if (type == '2') {
                html = html + warnRule.fieldName + '在' + warnRule.minutes + '分钟内,' + (warnRule.dimension == '1' ? '非重复数' : '总数') + comSymbolStr + warnRule.peakValue;
            }
            var info = {
                to: warnRule.email,
                subject: '【告警解除】-' + warnRule.name,
                html: html
            }
            //1.send mail (恢复邮件)
            MailUtil.sendMail(info);
            //2.update WarnRule(status, lastTime)
            warnRule.status = true;
            warnRule.lastTime = moment().format('YYYY-MM-DD HH:mm:ss');
            this.updateWarnRule(warnRule);
        },

        updateWarnRule: function (warnRule) {
            client.update({
                index: ES_CONSTANT.INDEX,
                type: ES_CONSTANT.ES_TYPE.WARN_RULE,
                id: warnRule.id,
                body: {
                    doc: warnRule
                },
                refresh: true
            }, function (err, response) {
                if (err) {
                    console.error('failed to update warnRule:' + err);
                }
            });
        }
    }
};