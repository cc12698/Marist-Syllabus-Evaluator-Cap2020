const multer = require("multer")
var fs = require('fs');
const config = require('../config');
const db2 = require('../db');

const AWS = require('aws-sdk');
var cos = config.cos;
var bodyParser = require('body-parser');
var util = require('util');

//store the uploaded file in uploads
module.exports.storage = multer.diskStorage({
  filename: (req, file, cb)=>{
    cb(null, Date.now() + file.originalname)
  }
});

/** ***************************************************
** Given an @param(sql) SQL query run in the database
** and return the result set
** DBM Code:  DBM-G06
** *************************************************** */
module.exports.query = (sql,options) => {
    return new Promise( (resolve,reject) => {
        db2.pool.open(db2.cn, (err,conn) => {
            if (err) {
                let msg = 'DBM-G06: Error connecting to the database in dataManager.query(): ' + err;
                logger.error(msg);
                notifySlack( msg);
                reject(new Error('DBM-G06: Error connecting to the database.'));
            } else {
                let stmt = conn.prepareSync(sql);
                stmt.execute([],function (err, result) {
                    if (err) {
                        let msg = err;
                        logger.error(msg);
                        notifySlack( msg);
                        reject(new Error('DBM-G06: Error retrieving data from the database.'));
                        // return false;
                    } else {
                        var data = result.fetchAllSync(options);
                        result.closeSync();
                        stmt.closeSync();
                        resolve(data);
                    }
                    conn.close(function(err){});
                });
            }
        });
    });
};

/** ***************************************************
** Given an @param(sql) SQL query and @param(values)
** an array of values run this query as a paramaterized
** query in the database and return the result set
** DBM Code:  DBM-G07
** *************************************************** */
module.exports.queryWithParams = (sql,values,options) => {
    return new Promise( (resolve,reject) => {
        db2.pool.open(db2.cn, (err,conn) => {
            if (err) {
                let msg = err;
                console.log(msg);
                reject(new Error('DBM-G07: Error connecting to the database.'));
                // return false;
            } else {

                let stmt = conn.prepareSync(sql);

                stmt.execute(values,function (err, result) {
                    if (err) {
                        let msg = err;
                        console.log(msg);
                        reject(new Error('DBM-G07: Error retrieving data from the database.'));
                        // return false;
                    } else {
                        var data = result.fetchAllSync(options);
                        result.closeSync();
                        stmt.closeSync();
                        resolve(data);
                        conn.close(function(err){});
                    }
                });

            }
        });
    });
};

module.exports.post = ( sql, parameters ) => {

    return new Promise( (resolve,reject) => {

        db2.pool.open(db2.cn, (err,conn) => {
            if (err) {
                console.log('DBM-P05: Error connecting to the database in databaseManager.put(): ' + err);
                reject(new Error('DBM-P05: Error connecting to the database.'));
            } else {
                try {

                    let stmt = conn.prepareSync(sql);
                    let result = stmt.executeSync( parameters );
                    let data = result.fetchAllSync();
                    stmt.closeSync();
                    conn.closeSync();
                    resolve(data);
                } catch(e) {
                    conn.closeSync();
                    console.log('DBM-P05: Error updating the database in dataManager.put(): ' + e);
                    reject(new Error('DBM-P05: Error updating the database.'));
                }


            }
        });
    });
};


module.exports.getUsers = () => {
    let sql = 'SELECT * FROM user';

    return this.queryWithParams(sql);
};

module.exports.getUserInfo = (username) => {
    let sql = 'SELECT * FROM user WHERE upper(username) = ?';

    return this.queryWithParams(sql, [username.toUpperCase()]).then();
};

// get all the items in the checklist
module.exports.getChecklist = () => {
    let sql = 'SELECT * FROM checklist';

    return this.queryWithParams(sql);
};

// get file from index.ejs and send to 'uploads'
module.exports.upload = multer({ storage: module.exports.storage}).single('sample_syl');

// retrieve the files from the COS bucket
module.exports.getBucketContents = (bucketName) => {
    // console.log(`Retrieving bucket contents from: ${bucketName}`);
    return cos.listObjects(
        {Bucket: bucketName},
    ).promise()
    .then((data) => {
        return data.Contents;
    })
    .catch((e) => {
        logger.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

module.exports.uploadSampleSyl = (filePath, fileName, mimetype, callback) => {
  var fileName = fileName;
  var filePath = filePath;
  const uploadFile = () => {
  fs.readFile(filePath, (err, data) => {
  if (err) callback(err);
  const params = {
           Bucket: 'sample-syl', // pass your bucket name
           Key: fileName, // file will be saved
           Body: data,
           ContentType: mimetype,
           ACL: 'public-read'
  };
  cos.upload(params, function(s3Err, data) {
  if (s3Err) throw s3Err
  console.log(`File uploaded successfully at ${data.Location}`)
  var location = data.Location;
  return callback();

       });
    });
  };
  uploadFile();
}

module.exports.deleteSyllabi = (fileName) => {
    var params = {  Bucket: 'sample-syl', Key: fileName };
    return cos.deleteObject(params)
      .promise()
    .then((data) => {
        return data.Contents;
    })
    .catch((e) => {
        console.log(e);
    });
}

// Delete User Syllabi from COS
module.exports.deleteUserSyllabi = (bucketName, fileName) => {
    var params = {  Bucket: bucketName, Key: fileName };
    return cos.deleteObject(params)
      .promise()
    .then((data) => {
        return data.Contents;
    })
    .catch((e) => {
        console.log(e);
    });
}

// Upload User Syllabus
module.exports.uploadUserSyl = (bucketName, filePath, fileName, mimetype) => {
  var fileName = fileName;
  var filePath = filePath;
  console.log(filePath);//IF THIS IS REMOVED EVERYTHING WILL BREAK
  return new Promise( (resolve,reject) => {
    const uploadFile = () => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      const params = {
               Bucket: bucketName, // pass your bucket name
               Key: fileName, // file will be saved
               Body: data,
               ContentType: mimetype,
               ACL: 'public-read'
      };
      cos.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
        var location = data.Location;
        resolve();
        });
      });
    };
    uploadFile();
  })
}

module.exports.updateChecklist = ( doc ) => {
    return new Promise( (resolve,reject) => {

      db2.pool.open(db2.cn, (err,conn) => {
          if (err) {
              logger.error('DBM-P04: Error connecting to the database in databaseManager.updateChecklist(): ' + err);
              reject(new Error('DBM-P04: Error connecting to the database.'));
          } else {
              try {
                  conn.beginTransactionSync();
                  var stmt1 = conn.prepareSync("update checklist set checked = false where checked = true");
                  var result1 = stmt1.executeSync();
                  stmt1.executeSync;
                  result1.fetchAllSync();
                  stmt1.closeSync();

                  var stmt2 = conn.prepareSync("update checklist set checked = true where item_name = ?");

                  // logger.info('success');
                  for(var i = 0; i < doc.ITEMS.length; i++){
                    var result = stmt2.executeSync([doc.ITEMS[i]]);
                    stmt2.executeSync;
                    result.fetchAllSync();
                  }

                  stmt2.closeSync();
                  conn.commitTransactionSync();
                  conn.closeSync();
                  resolve(doc);
              } catch(e) {
                  conn.rollbackTransactionSync();
                  conn.closeSync();
                  logger.error('DBM-P04: Error posting to the database in dataManager.updateChecklist(): ' + e);
                  reject(new Error('DBM-P04: Error posting to the database.'));
              }
              conn.close(function(err){});

          }
      });
    });

};

// Create a new bucket for each user
module.exports.createBucket = (bucketName)  => {
    console.log(`Creating new bucket: ${bucketName}`);
    return cos.createBucket({
        Bucket: bucketName,
        ACL: 'public-read',
        CreateBucketConfiguration: {
          LocationConstraint: 'us-south-standard'
        },
    }).promise()
    .then((() => {
        return 'bucket created!';
    }))
    .catch((e) => {
        return `ERROR: ${e.code} - ${e.message}\n`;
    });
}

// Add User to DB - First Time Logging in
module.exports.addUser = ( doc ) => {
    var sql = "INSERT into USER (USER_ID, USERNAME, USER_ROLE) VALUES (USER_SEQ.NEXTVAL, ?, 'user')";

    return this.post( sql, [doc.USERNAME]);
};
