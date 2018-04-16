var http = require('http');

var moment = require('moment');

var date = new Date();
var end = Math.floor(date.getTime() / 1000);

var start = end - 3600;//  #查询过去一小时的数据

var d = {
    "start": start,
    "end": end,
    "cf": "AVERAGE",
    "endpoint_counters": [
        {
            "endpoint": "slave3.vfhdfs.com",
            "counter": "cpu.idle"
        },
        {
            "endpoint": "slave3.vfhdfs.com",
            "counter": "load.1min"
        }
    ]
}

var url = "http://10.5.6.35:9966/graph/history"
var req = http.request({
    host: '10.5.6.35',
    port: 9966,
    path: '/graph/history',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end', function () {
        console.log('No more data in response.')
    })
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(JSON.stringify(d));
req.end();

var body = [{
    "endpoint": "slave3.vfhdfs.com",
    "counter": "cpu.idle",
    "dstype": "GAUGE",
    "step": 60,
    "Values": [{"timestamp": 1449550140, "value": 99.750000}, {
        "timestamp": 1449550200,
        "value": 100.000000
    }, {"timestamp": 1449550260, "value": 99.750000}, {
        "timestamp": 1449550320,
        "value": 99.750623
    }, {"timestamp": 1449550380, "value": 100.000000}, {
        "timestamp": 1449550440,
        "value": 100.000000
    }, {"timestamp": 1449550500, "value": 100.000000}, {
        "timestamp": 1449550560,
        "value": 100.000000
    }, {"timestamp": 1449550620, "value": 100.000000}, {
        "timestamp": 1449550680,
        "value": 100.000000
    }, {"timestamp": 1449550740, "value": 100.000000}, {
        "timestamp": 1449550800,
        "value": 100.000000
    }, {"timestamp": 1449550860, "value": 99.750623}, {
        "timestamp": 1449550920,
        "value": 100.000000
    }, {"timestamp": 1449550980, "value": 100.000000}, {
        "timestamp": 1449551040,
        "value": 100.000000
    }, {"timestamp": 1449551100, "value": 100.000000}, {
        "timestamp": 1449551160,
        "value": 100.000000
    }, {"timestamp": 1449551220, "value": 99.250000}, {
        "timestamp": 1449551280,
        "value": 99.498747
    }, {"timestamp": 1449551340, "value": 98.997494}, {
        "timestamp": 1449551400,
        "value": 99.250000
    }, {"timestamp": 1449551460, "value": 98.997494}, {
        "timestamp": 1449551520,
        "value": 99.500000
    }, {"timestamp": 1449551580, "value": 98.750000}, {
        "timestamp": 1449551640,
        "value": 99.750623
    }, {"timestamp": 1449551700, "value": 99.498747}, {
        "timestamp": 1449551760,
        "value": 100.000000
    }, {"timestamp": 1449551820, "value": 99.250000}, {
        "timestamp": 1449551880,
        "value": 100.000000
    }, {"timestamp": 1449551940, "value": 99.750623}, {
        "timestamp": 1449552000,
        "value": 99.251870
    }, {"timestamp": 1449552060, "value": 99.250000}, {
        "timestamp": 1449552120,
        "value": 100.000000
    }, {"timestamp": 1449552180, "value": 99.498747}, {
        "timestamp": 1449552240,
        "value": 99.750000
    }, {"timestamp": 1449552300, "value": 100.000000}, {
        "timestamp": 1449552360,
        "value": 99.250000
    }, {"timestamp": 1449552420, "value": 100.000000}, {
        "timestamp": 1449552480,
        "value": 100.000000
    }, {"timestamp": 1449552540, "value": 100.000000}, {
        "timestamp": 1449552600,
        "value": 99.500000
    }, {"timestamp": 1449552660, "value": 99.251870}, {
        "timestamp": 1449552720,
        "value": 99.251870
    }, {"timestamp": 1449552780, "value": 100.000000}, {
        "timestamp": 1449552840,
        "value": 100.000000
    }, {"timestamp": 1449552900, "value": 99.750000}, {
        "timestamp": 1449552960,
        "value": 99.000000
    }, {"timestamp": 1449553020, "value": 100.000000}, {
        "timestamp": 1449553080,
        "value": 100.000000
    }, {"timestamp": 1449553140, "value": 100.000000}, {
        "timestamp": 1449553200,
        "value": 100.000000
    }, {"timestamp": 1449553260, "value": 100.000000}, {
        "timestamp": 1449553320,
        "value": 100.000000
    }, {"timestamp": 1449553380, "value": 100.000000}, {
        "timestamp": 1449553440,
        "value": 99.750623
    }, {"timestamp": 1449553500, "value": 100.000000}, {
        "timestamp": 1449553560,
        "value": 100.000000
    }, {"timestamp": 1449553620, "value": 99.750623}, {"timestamp": 1449553680, "value": 99.750623}]
}, {
    "endpoint": "slave3.vfhdfs.com",
    "counter": "load.1min",
    "dstype": "GAUGE",
    "step": 60,
    "Values": [{"timestamp": 1449550140, "value": 0.000000}, {
        "timestamp": 1449550200,
        "value": 0.000000
    }, {"timestamp": 1449550260, "value": 0.000000}, {
        "timestamp": 1449550320,
        "value": 0.000000
    }, {"timestamp": 1449550380, "value": 0.000000}, {
        "timestamp": 1449550440,
        "value": 0.000000
    }, {"timestamp": 1449550500, "value": 0.000000}, {
        "timestamp": 1449550560,
        "value": 0.040000
    }, {"timestamp": 1449550620, "value": 0.010000}, {
        "timestamp": 1449550680,
        "value": 0.010000
    }, {"timestamp": 1449550740, "value": 0.000000}, {
        "timestamp": 1449550800,
        "value": 0.000000
    }, {"timestamp": 1449550860, "value": 0.000000}, {
        "timestamp": 1449550920,
        "value": 0.000000
    }, {"timestamp": 1449550980, "value": 0.000000}, {
        "timestamp": 1449551040,
        "value": 0.000000
    }, {"timestamp": 1449551100, "value": 0.000000}, {
        "timestamp": 1449551160,
        "value": 0.000000
    }, {"timestamp": 1449551220, "value": 0.000000}, {
        "timestamp": 1449551280,
        "value": 0.000000
    }, {"timestamp": 1449551340, "value": 0.000000}, {
        "timestamp": 1449551400,
        "value": 0.000000
    }, {"timestamp": 1449551460, "value": 0.000000}, {
        "timestamp": 1449551520,
        "value": 0.000000
    }, {"timestamp": 1449551580, "value": 0.000000}, {
        "timestamp": 1449551640,
        "value": 0.000000
    }, {"timestamp": 1449551700, "value": 0.000000}, {
        "timestamp": 1449551760,
        "value": 0.000000
    }, {"timestamp": 1449551820, "value": 0.000000}, {
        "timestamp": 1449551880,
        "value": 0.000000
    }, {"timestamp": 1449551940, "value": 0.000000}, {
        "timestamp": 1449552000,
        "value": 0.000000
    }, {"timestamp": 1449552060, "value": 0.000000}, {
        "timestamp": 1449552120,
        "value": 0.000000
    }, {"timestamp": 1449552180, "value": 0.000000}, {
        "timestamp": 1449552240,
        "value": 0.000000
    }, {"timestamp": 1449552300, "value": 0.000000}, {
        "timestamp": 1449552360,
        "value": 0.000000
    }, {"timestamp": 1449552420, "value": 0.000000}, {
        "timestamp": 1449552480,
        "value": 0.050000
    }, {"timestamp": 1449552540, "value": 0.020000}, {
        "timestamp": 1449552600,
        "value": 0.010000
    }, {"timestamp": 1449552660, "value": 0.000000}, {
        "timestamp": 1449552720,
        "value": 0.000000
    }, {"timestamp": 1449552780, "value": 0.000000}, {
        "timestamp": 1449552840,
        "value": 0.000000
    }, {"timestamp": 1449552900, "value": 0.000000}, {
        "timestamp": 1449552960,
        "value": 0.000000
    }, {"timestamp": 1449553020, "value": 0.000000}, {
        "timestamp": 1449553080,
        "value": 0.000000
    }, {"timestamp": 1449553140, "value": 0.000000}, {
        "timestamp": 1449553200,
        "value": 0.000000
    }, {"timestamp": 1449553260, "value": 0.000000}, {
        "timestamp": 1449553320,
        "value": 0.000000
    }, {"timestamp": 1449553380, "value": 0.000000}, {
        "timestamp": 1449553440,
        "value": 0.000000
    }, {"timestamp": 1449553500, "value": 0.000000}, {
        "timestamp": 1449553560,
        "value": 0.000000
    }, {"timestamp": 1449553620, "value": 0.000000}, {"timestamp": 1449553680, "value": 0.000000}]
}];

console.log(body.length);
console.log(body[0].length);