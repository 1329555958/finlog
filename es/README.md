# 查看当前模板
curl http://10.65.215.34:9201/_template

# 添加模板
curl -X PUT http://10.65.215.34:9201/_template/flume -d @es-tmpl.json