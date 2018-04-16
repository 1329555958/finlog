# finlog 日志系统
-----

## Install

* 在根目录下执行 grunt (若没有全局安装grunt,可在node_modules/.bin目录下执行),在dist目录下会生成 一个压缩包
* 将压缩包解压到需要安装的路径
* 修改config下的配置信息,如果有需要
* 执行bin目录下对应的启动文件 start.sh/start.bat
* 启动完成,在浏览器中输入http://localhost:3000,如果你没有改端口的话

## nodejs 安装
* 下载地址:https://nodejs.org/zh-cn/download/ 
* 解压 tar -Jxf linux-3.12.tar.xz
* 把/bin下面的导出到path

## es模板
如果使用的是flume就需要执行es下面的模板，logstash自带就不用执行了