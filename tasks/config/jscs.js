/**
 * Created by weichunhe on 2015/11/8.
 * http://jscs.info/rules
 *
 */
module.exports = function (grunt) {
    return { //如果执行的时候发现不可理解的提示时很有可能是因为你的grunt-jscs 插件安装不完全
        options: {
            "disallowEmptyBlocks": true, //不允许空块
            "disallowKeywordsInComments": true,//不允许出现 TODO,FIXME 等在注释里
            "disallowNestedTernaries": true, //三元表达式 只允许一层
            "disallowNewlineBeforeBlockStatements": true,//大括号之前不允许换行
            "disallowTabs": true,//不允许使用tab键
            "disallowTrailingComma": true, //不允许多余的逗号
            "maximumLineLength": 160,//单行最大字符数
            //"maximumNumberOfLines": 100,//单文件最多行数
            "requireBlocksOnNewline": true,//代码块要换行
            /*注释*/
            "jsDoc": {
                "checkAnnotations": "closurecompiler",
                "checkParamExistence": true,
                "checkParamNames": true,
                "checkRedundantParams": true
            },
            "disallowMultipleLineBreaks": true //不允许多行空行
        },
        all: ['public/js/*.js']
    }
};