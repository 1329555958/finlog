/**
 * Created by weichunhe on 2015/10/26.
 */
var a = {
    "logstash-2015.10.14": {
        "mappings": {
            "_default_": {
                "_routing": {
                    "full_name": "_routing",
                    "mapping": {}
                },
                "_ttl": {
                    "full_name": "_ttl",
                    "mapping": {}
                },
                "_index": {
                    "full_name": "_index",
                    "mapping": {}
                },
                "_type": {
                    "full_name": "_type",
                    "mapping": {}
                },
                "_all": {
                    "full_name": "_all",
                    "mapping": {
                        "_all": {
                            "enabled": true,
                            "omit_norms": true
                        }
                    }
                },
                "_size": {
                    "full_name": "_size",
                    "mapping": {}
                },
                "_boost": {
                    "full_name": "_boost",
                    "mapping": {}
                },
                "_parent": {
                    "full_name": "_parent",
                    "mapping": {}
                },
                "_field_names": {
                    "full_name": "_field_names",
                    "mapping": {}
                },
                "geoip.location": {
                    "full_name": "geoip.location",
                    "mapping": {
                        "location": {
                            "type": "geo_point"
                        }
                    }
                },
                "@version": {
                    "full_name": "@version",
                    "mapping": {
                        "@version": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                },
                "_source": {
                    "full_name": "_source",
                    "mapping": {}
                },
                "_id": {
                    "full_name": "_id",
                    "mapping": {}
                },
                "_timestamp": {
                    "full_name": "_timestamp",
                    "mapping": {}
                },
                "_version": {
                    "full_name": "_version",
                    "mapping": {}
                },
                "_uid": {
                    "full_name": "_uid",
                    "mapping": {}
                }
            },
            "file": {
                "hostName": {
                    "full_name": "hostName",
                    "mapping": {
                        "hostName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_ttl": {
                    "full_name": "_ttl",
                    "mapping": {}
                },
                "_index": {
                    "full_name": "_index",
                    "mapping": {}
                },
                "level.raw": {
                    "full_name": "level.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "type": {
                    "full_name": "type",
                    "mapping": {
                        "type": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "envInfo.raw": {
                    "full_name": "envInfo.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_all": {
                    "full_name": "_all",
                    "mapping": {
                        "_all": {
                            "enabled": true,
                            "omit_norms": true
                        }
                    }
                },
                "_size": {
                    "full_name": "_size",
                    "mapping": {}
                },
                "_boost": {
                    "full_name": "_boost",
                    "mapping": {}
                },
                "_parent": {
                    "full_name": "_parent",
                    "mapping": {}
                },
                "geoip.location": {
                    "full_name": "geoip.location",
                    "mapping": {
                        "location": {
                            "type": "geo_point"
                        }
                    }
                },
                "filePath.raw": {
                    "full_name": "filePath.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "envInfo": {
                    "full_name": "envInfo",
                    "mapping": {
                        "envInfo": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@version": {
                    "full_name": "@version",
                    "mapping": {
                        "@version": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                },
                "_timestamp": {
                    "full_name": "_timestamp",
                    "mapping": {}
                },
                "_version": {
                    "full_name": "_version",
                    "mapping": {}
                },
                "hostName.raw": {
                    "full_name": "hostName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_routing": {
                    "full_name": "_routing",
                    "mapping": {}
                },
                "tags.raw": {
                    "full_name": "tags.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "level": {
                    "full_name": "level",
                    "mapping": {
                        "level": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "appName": {
                    "full_name": "appName",
                    "mapping": {
                        "appName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "filePath": {
                    "full_name": "filePath",
                    "mapping": {
                        "filePath": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_type": {
                    "full_name": "_type",
                    "mapping": {}
                },
                "type.raw": {
                    "full_name": "type.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "message": {
                    "full_name": "message",
                    "mapping": {
                        "message": {
                            "type": "string",
                            "norms": {
                                "enabled": false
                            }
                        }
                    }
                },
                "tags": {
                    "full_name": "tags",
                    "mapping": {
                        "tags": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@timestamp": {
                    "full_name": "@timestamp",
                    "mapping": {
                        "@timestamp": {
                            "type": "date",
                            "format": "dateOptionalTime"
                        }
                    }
                },
                "_field_names": {
                    "full_name": "_field_names",
                    "mapping": {}
                },
                "_source": {
                    "full_name": "_source",
                    "mapping": {}
                },
                "_id": {
                    "full_name": "_id",
                    "mapping": {}
                },
                "_uid": {
                    "full_name": "_uid",
                    "mapping": {}
                },
                "appName.raw": {
                    "full_name": "appName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                }
            },
            "tomcat": {
                "_ttl": {
                    "full_name": "_ttl",
                    "mapping": {}
                },
                "hostName": {
                    "full_name": "hostName",
                    "mapping": {
                        "hostName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_index": {
                    "full_name": "_index",
                    "mapping": {}
                },
                "type": {
                    "full_name": "type",
                    "mapping": {
                        "type": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "envInfo.raw": {
                    "full_name": "envInfo.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_all": {
                    "full_name": "_all",
                    "mapping": {
                        "_all": {
                            "enabled": true,
                            "omit_norms": true
                        }
                    }
                },
                "_size": {
                    "full_name": "_size",
                    "mapping": {}
                },
                "_boost": {
                    "full_name": "_boost",
                    "mapping": {}
                },
                "_parent": {
                    "full_name": "_parent",
                    "mapping": {}
                },
                "geoip.location": {
                    "full_name": "geoip.location",
                    "mapping": {
                        "location": {
                            "type": "geo_point"
                        }
                    }
                },
                "filePath.raw": {
                    "full_name": "filePath.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "envInfo": {
                    "full_name": "envInfo",
                    "mapping": {
                        "envInfo": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@version": {
                    "full_name": "@version",
                    "mapping": {
                        "@version": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                },
                "_version": {
                    "full_name": "_version",
                    "mapping": {}
                },
                "_timestamp": {
                    "full_name": "_timestamp",
                    "mapping": {}
                },
                "hostName.raw": {
                    "full_name": "hostName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "tags.raw": {
                    "full_name": "tags.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_routing": {
                    "full_name": "_routing",
                    "mapping": {}
                },
                "appName": {
                    "full_name": "appName",
                    "mapping": {
                        "appName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "filePath": {
                    "full_name": "filePath",
                    "mapping": {
                        "filePath": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_type": {
                    "full_name": "_type",
                    "mapping": {}
                },
                "type.raw": {
                    "full_name": "type.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "message": {
                    "full_name": "message",
                    "mapping": {
                        "message": {
                            "type": "string",
                            "norms": {
                                "enabled": false
                            }
                        }
                    }
                },
                "tags": {
                    "full_name": "tags",
                    "mapping": {
                        "tags": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@timestamp": {
                    "full_name": "@timestamp",
                    "mapping": {
                        "@timestamp": {
                            "type": "date",
                            "format": "dateOptionalTime"
                        }
                    }
                },
                "_field_names": {
                    "full_name": "_field_names",
                    "mapping": {}
                },
                "_source": {
                    "full_name": "_source",
                    "mapping": {}
                },
                "_id": {
                    "full_name": "_id",
                    "mapping": {}
                },
                "_uid": {
                    "full_name": "_uid",
                    "mapping": {}
                },
                "appName.raw": {
                    "full_name": "appName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                }
            },
            "tomcataccess": {
                "hostName": {
                    "full_name": "hostName",
                    "mapping": {
                        "hostName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_ttl": {
                    "full_name": "_ttl",
                    "mapping": {}
                },
                "_index": {
                    "full_name": "_index",
                    "mapping": {}
                },
                "type": {
                    "full_name": "type",
                    "mapping": {
                        "type": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "envInfo.raw": {
                    "full_name": "envInfo.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_all": {
                    "full_name": "_all",
                    "mapping": {
                        "_all": {
                            "enabled": true,
                            "omit_norms": true
                        }
                    }
                },
                "_size": {
                    "full_name": "_size",
                    "mapping": {}
                },
                "_boost": {
                    "full_name": "_boost",
                    "mapping": {}
                },
                "_parent": {
                    "full_name": "_parent",
                    "mapping": {}
                },
                "geoip.location": {
                    "full_name": "geoip.location",
                    "mapping": {
                        "location": {
                            "type": "geo_point"
                        }
                    }
                },
                "filePath.raw": {
                    "full_name": "filePath.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "envInfo": {
                    "full_name": "envInfo",
                    "mapping": {
                        "envInfo": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@version": {
                    "full_name": "@version",
                    "mapping": {
                        "@version": {
                            "type": "string",
                            "index": "not_analyzed"
                        }
                    }
                },
                "_version": {
                    "full_name": "_version",
                    "mapping": {}
                },
                "_timestamp": {
                    "full_name": "_timestamp",
                    "mapping": {}
                },
                "hostName.raw": {
                    "full_name": "hostName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "tags.raw": {
                    "full_name": "tags.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "_routing": {
                    "full_name": "_routing",
                    "mapping": {}
                },
                "appName": {
                    "full_name": "appName",
                    "mapping": {
                        "appName": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "filePath": {
                    "full_name": "filePath",
                    "mapping": {
                        "filePath": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "_type": {
                    "full_name": "_type",
                    "mapping": {}
                },
                "type.raw": {
                    "full_name": "type.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                },
                "message": {
                    "full_name": "message",
                    "mapping": {
                        "message": {
                            "type": "string",
                            "norms": {
                                "enabled": false
                            }
                        }
                    }
                },
                "tags": {
                    "full_name": "tags",
                    "mapping": {
                        "tags": {
                            "type": "string",
                            "index": "not_analyzed",
                            "fields": {
                                "raw": {
                                    "type": "string",
                                    "index": "not_analyzed",
                                    "ignore_above": 256
                                }
                            }
                        }
                    }
                },
                "@timestamp": {
                    "full_name": "@timestamp",
                    "mapping": {
                        "@timestamp": {
                            "type": "date",
                            "format": "dateOptionalTime"
                        }
                    }
                },
                "_field_names": {
                    "full_name": "_field_names",
                    "mapping": {}
                },
                "_source": {
                    "full_name": "_source",
                    "mapping": {}
                },
                "_id": {
                    "full_name": "_id",
                    "mapping": {}
                },
                "_uid": {
                    "full_name": "_uid",
                    "mapping": {}
                },
                "appName.raw": {
                    "full_name": "appName.raw",
                    "mapping": {
                        "raw": {
                            "type": "string",
                            "index": "not_analyzed",
                            "ignore_above": 256
                        }
                    }
                }
            }
        }
    }
};