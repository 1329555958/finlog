/**
 * 换肤步骤：
 * 1、修改 bower_components/AdminLTE/build/less/variables.less 中 @light-blue 的色值
 * 2、修改bower_components/bootstrap-datepicker/build/build3.less中@brand-primary色值
 * 3、修改bower_components/eonasdan-bootstrap-datetimepicker/src/less/_bootstrap-datetimepicker.less中@bs-datetimepicker-active-color
 * 4、执行 grunt less
 */

var _ = require('lodash');
module.exports = function (grunt) {
    var files = {}, cwd = 'bower_components/AdminLTE/';
    _.each({
        "dist/css/AdminLTE.min.css": "build/less/AdminLTE.less",
        "dist/css/skins/skin-blue.min.css": "build/less/skins/skin-blue.less"
    }, function (val, key) {
        files[cwd + key] = cwd + val;
    });
    return {
        production: {
            options: {
                // Whether to compress or not
                compress: true
            },
            files: _.extend(files, {
                "public/css/hack.css": "public/css/hack.less",
                'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.standalone.min.css': 'bower_components/bootstrap-datepicker/build/build_standalone3.less',
                'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css': 'bower_components/eonasdan-bootstrap-datetimepicker/src/less/bootstrap-datetimepicker-build.less'
            })
        }
    }
};