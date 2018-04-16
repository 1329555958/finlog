/**
 * Created by weichunhe on 2015/11/6.
 */
var rquCfg = require('../../public/lib/js/require-config');
var _ = require('lodash');
var cfg = require('../config')();
module.exports = function (grunt) {
    var files = [];
    //将前端依赖的js 统一 copy 到 lib/js
    _.each(rquCfg.paths, function (val, key) {
        files.push({src: '.' + val + '.js', dest: cfg.assets});
    });

    //统计 发布版本所依赖的node module
    var pkg = grunt.file.readJSON('./package.json');
    var deps = _.keys(pkg.dependencies);
    var files2 = [];
    _.each(deps, function (d) {
        files2.push({src: 'node_modules/' + d + '/**/*.*', dest: cfg.release});
    });

    return {
        //复制所有基础js
        lib: {
            files: files
        },
        release: { //发布所依赖的文件
            files: files2.concat([
                {src: 'bin/server.js', dest: cfg.release},
                {src: 'bin/start.*', dest: cfg.release},
                {src: 'config/**', dest: cfg.release},
                {src: 'public/**', dest: cfg.release},
                {src: 'routes/**', dest: cfg.release},
                {src: 'service/**', dest: cfg.release},
                {src: 'views/**', dest: cfg.release},
                {src: 'app.js', dest: cfg.release},
                {src: 'package.json', dest: cfg.release},
                {src: 'README.md', dest: cfg.release},
                //下面是特殊依赖 css，js等
                {cwd: cfg.assets, src: 'bower_components/**/*.*', dest: cfg.release},
                {src: 'bower_components/ace-builds/src-min-noconflict/**/*.*', dest: cfg.release},
                {src: 'bower_components/AdminLTE/bootstrap/css/bootstrap.min.css', dest: cfg.release},
                {src: 'bower_components/AdminLTE/bootstrap/fonts/*.*', dest: cfg.release},
                {src: 'bower_components/seiyria-bootstrap-slider/dist/**/*.min.*', dest: cfg.release},
                {src: 'bower_components/font-awesome/css/font-awesome.min.css', dest: cfg.release},
                {src: 'bower_components/font-awesome/fonts/*', dest: cfg.release},
                {src: 'bower_components/AdminLTE/dist/css/**/*.min.*', dest: cfg.release},
                {src: 'bower_components/AdminLTE/plugins/datatables/dataTables.bootstrap.css', dest: cfg.release},
                {
                    src: 'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                    dest: cfg.release
                },
                {
                    src: 'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datepicker3.standalone.min.css',
                    dest: cfg.release
                },
                {
                    src: 'bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min.js',
                    dest: cfg.release
                }
            ])
        }
    }
};