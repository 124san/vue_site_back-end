const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// We have to export each object in order to access them separately
exports.sqluser = parsed.mysql_username;
exports.sqlpw = parsed.mysql_pw;
exports.mongouser = parsed.mongo_username;
exports.mongopw = parsed.mongo_pw;