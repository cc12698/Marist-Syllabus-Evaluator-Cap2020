require('dotenv').config();
const winston = require('winston');

const AWS = require('aws-sdk');
var util = require('util');

const passport = require('passport')
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;

var config = {
    endpoint: process.env.ENDPOINT,
    apiKeyId: process.env.API_KEY_ID,
    ibmAuthEndpoint: process.env.IBM_AUTH_ENDPOINT,
    serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};


const logger = {
    development: () => {
        return winston.createLogger ({
            level : process.env.LOG_LEVEL || 'debug',
            transports: [
                new ( winston.transports.Console)({
                    colorize: true,
                    timestamp: true,
                    json: false
                })
            ]
        });
    },
    production: () => {
        return winston.createLogger ({
            level : process.env.LOG_LEVEL || 'info',
            transports: [
                new ( winston.transports.Console)({
                    colorize: true,
                    timestamp: true,
                    json: false
                })
            ]
        });
    },
    test: () => {
        return winston.createLogger ({
            level : 'fatal',
            transports: [
                new ( winston.transports.Console)({
                    colorize: true,
                    timestamp: true,
                    json: false
                })
            ]
        });
    }
};

module.exports = {
    dbConnections: process.env.DB_CONNECTIONS || 10,
    dbConnectURL: process.env.DB_CONNECT_URL,
    log: (env) => {
        if(env) return logger[env]();
        return logger[process.env.NODE_ENV || 'development']();
    },
};


// getBuckets();

createCosConnection();

function createCosConnection() {
  module.exports.cos = new AWS.S3(config);
}
// getBucketContents('sample-syl');

function getBuckets() {
    console.log('Retrieving list of buckets');
    return module.exports.cos.listBuckets()
    .promise()
    .then((data) => {
        if (data.Buckets != null) {
            for (var i = 0; i < data.Buckets.length; i++) {
                console.log(`Bucket Name: ${data.Buckets[i].Name}`);
            }
        }
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}



function getBucketContents(bucketName) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    return module.exports.cos.listObjects(
        {Bucket: bucketName},
    ).promise()
    .then((data) => {
        if (data != null && data.Contents != null) {
            for (var i = 0; i < data.Contents.length; i++) {
                var itemKey = data.Contents[i].Key;
                var itemSize = data.Contents[i].Size;
                console.log(`Item: ${itemKey} (${itemSize} bytes).`)
            }
        }
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
