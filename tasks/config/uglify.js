/**
 * Created by weichunhe on 2015/11/6.
 */
var cfg = require('../config')();
module.exports = function (grunt) {
    return {
        options: {
            banner: '<%= banner %>',
            mangle: false,
            report: "min"
        },
        build: {
            //将所有基础js进行压缩
            files: [{
                expand: true,
                cwd: cfg.assets,
                src: ['**/*.js'],
                dest: cfg.assets_min,
                flatten: true
            }, { //与页面相关的js进行压缩
                expand: true,
                cwd: 'public/js',
                src: ['**/*.js'],
                dest: 'public/js-min'
            }]
        }
    }
};