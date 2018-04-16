/**
 * Created by weichunhe on 2015/11/6.
 */
module.exports = function (grunt) {
    grunt.registerTask('build', [
        // 清空 dist 目录,如果不存在就新建
        'clean',
        'touch', //创建对应的目录
        'copy:lib', //复制所有依赖js
        'uglify', //压缩
        'concat', //合并
        'clean:assets', //清空临时目录
        'copy:release',
        'compress',
        'clean:release'
    ]);
};


/*------------------整理前端--------------------------*/
//将文件压缩进asset 目录


/*------------------整理后端 -------------------------*/
//将文件压缩进 server 目录