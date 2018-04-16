/**
 * Created by baodekang on 2015/11/3.
 */
var CronJob = require('cron').CronJob;
var client = require('../client/es');
var ES_CONSTANT = require('../utils/EsConstant');
var WarnRuleMonitor = require('../monitor/WarnRuleMonitor');
var WarnRuleModel = require('../model/WarnRuleModel');

module.exports = function(warnRuleEnum){
    this.addJob = function(){
        new CronJob(warnRuleEnum.cron, this.onTick, this.onComplete, true, 'Asia/Shanghai'
        );
    };
    this.onTick = function(){
        //1.查询规则
        client.search({
            index: ES_CONSTANT.INDEX,
            type : ES_CONSTANT.ES_TYPE.WARN_RULE,
            body:{
                query: {
                    bool:{
                        must: [
                            {
                                term: {
                                    frequency: warnRuleEnum.frequency
                                }
                            },
                            {
                                term: {
                                    frequencyUnit: warnRuleEnum.unit
                                }
                            },
                            {
                                term: {
                                    disabled: false
                                }
                            }
                        ]
                    }
                }
            },
            size: 50
        }, function (error, response) {
            if(error){
                console.error(error);
                return;
            }
            var hits = response.hits.hits;
            hits.forEach(function(hit){
                var warnRule = new WarnRuleModel();
                for(var key in hit._source){
                    warnRule[key] = hit._source[key];
                }
                warnRule.id = hit._id;
                //2.执行规则
                var type = warnRule.type,
                    monitor = new WarnRuleMonitor(warnRule);

                switch(type){
                    case '1':
                        count = monitor.logNumber(monitor.process);
                        break;
                    case '2':
                        count = monitor.fieldCount(monitor.process);
                        break;
                }
            });
        });
    };

    this.onComplete = function(){
        console.log('end of warn rule job!');
    };
};