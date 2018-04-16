/*global module:false*/
var _ = require('lodash');
module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');
    //配置文件
    var cfg = {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        basedir: __dirname,
        banner: '/*! <%=name%> - v<%= version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>' +
        ' Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%=author%>; Licensed MIT */\n'
    };

    /**
     * 加载插件
     * package.json 中 devDependencies 中以grunt-开头的插件
     */
    _.each(pkg.devDependencies, function (val, key) {
        if (_.startsWith(key, 'grunt-')) {
            grunt.loadNpmTasks(key);
        }
    });
    //加载tasks目录下的所有任务
    require('load-grunt-config')(grunt, {
        configPath: __dirname + '/tasks/config',
        init: true,
        config: cfg
    });

    grunt.task.loadTasks('tasks');
    // Default task.
    grunt.registerTask('default', ['build']);
};
