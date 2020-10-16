require('dotenv').config();

const AWS = require('aws-sdk');
var util = require('util');

config = {
    endpoint: process.env.ENDPOINT,
    apiKeyId: process.env.API_KEY_ID,
    ibmAuthEndpoint: process.env.IBM_AUTH_ENDPOINT,
    serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

module.exports.cos = new AWS.S3(config);


module.exports = {
    dbConnections: process.env.DB_CONNECTIONS || 10,
    dbConnectURL: process.env.DB_CONNECT_URL
};


getBuckets();
// getBucketContents('sample-syl');

function getBuckets() {
    module.exports.cos = new AWS.S3(config);
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
