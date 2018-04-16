/**
 * Created by weichunhe on 2015/11/8.
 */
module.exports = function (grunt) {
    return {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            expr:true
        },
        all: ['public/js/*.js']
    }
};