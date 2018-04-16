/**
 * Created by weichunhe on 2015/11/10.
 */
var rquCfg = require('../../public/lib/js/require-config');
var _ = require('lodash');
var cfg = require('../config')();
module.exports = function (grunt) {
    var files = [];
    //将前端依赖的js 统一 copy 到 lib/js
    _.each(rquCfg.paths, function (val, key) {
        files.push({src: '.' + val + '.js', dest: 'dist/assets/lib/js/'});
    });

    return {
        main: {
            options: {
                archive: cfg.zip + 'finlog.zip'
            },
            files: [{cwd: cfg.release, src: '**/*.*'}]
        }
    }
};