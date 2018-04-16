:: https://github.com/petruisfan/node-supervisor

:: 安装
:: npm install supervisor -g

::监控 文件变化 自动重启
supervisor -w ..\routes,..\service --debug -x node server.js