'use strict';

const config = require('../config');
//const logger = config.log();

const Pool = require('ibm_db').Pool, pool = new Pool(); pool.init(config.dbConnections,config.dbConnectURL);


module.exports = {
    pool: pool,
    cn : config.dbConnectURL
};
