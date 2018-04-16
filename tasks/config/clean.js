/**
 * Created by weichunhe on 2015/11/6.
 */
var cfg = require('../config')();
module.exports = function (grunt) {
    return {
        dist: {
            src: 'dist/**'
        },
        jsmin: {
            src: 'public/js-min'
        },
        assets: {
            src: cfg.assets_min + '**'
        },
        release: {
            src: ['dist/assets/**', 'dist/release/**']
        }
    }
};