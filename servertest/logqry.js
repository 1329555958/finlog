/**
 * Created by weichunhe on 2015/11/30.
 */
var _ = require('lodash');
var client = require('../service/client/es');

client.es_search({
    index: 'logstash-2015.11.30', type: 'file', body: {
        "query": {
            "bool": {
                "must": [
                    {wildcard: {appName: "counter-api"}},
                    {wildcard: {hostName: "dev21618"}},
                    {
                        "range": {
                            "@timestamp": {
                                "gte": 1448861893000,
                                "lte": 1448861913000
                            }
                        }
                    }
                ]
            }
        }
        , "sort": [
            {
                "@timestamp": {
                    "order": "asc"
                }
            }
        ]
    }
}, {}, function (data) {
    console.log(data);
});