/**
 * Created by weichunhe on 2015/11/6.
 */
/**
 * 创建 编译后所需要的目录
 * @param grunt
 */
var _ = require('lodash');
var cfg = require('./config')();
module.exports = function (grunt) {
    var dirs = _.values(cfg);
    grunt.registerTask('touch', function () {
        _.each(dirs, function (val) {
            grunt.file.mkdir(val);
        });
    });
};