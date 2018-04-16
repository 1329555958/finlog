/**
 * Created by weichunhe on 2015/11/6.
 */
var rquCfg = require('../../public/lib/js/require-config');
var _ = require('lodash');
var cfg = require('../config')();

module.exports = function (grunt) {
    //获取压缩后的文件名称列表
    var src = _.chain(rquCfg.paths).values().transform(function (result, val) {
        result.push(_.last(val.split('/')) + '.js');
    }).value();
    return {
        dist: {
            options: { //这里 将define 转换为了使所有文件压缩后正常
                banner: '/*' + JSON.stringify(src) + '*/\n'
                + 'window._define = window.define; window.define=undefined;'
                , footer: ';window.define = window._define; window._define=undefined;'
            },
            //对压缩后的文件进行合并
            src: _.transform(src, function (result, val) {
                result.push(cfg.assets_min + val);
            }),
            dest: 'public/lib/js/index.js' //直接存在合并后的js
        }
    }
};