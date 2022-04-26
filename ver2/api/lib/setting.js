const fs = require('fs');
require('dotenv').config()

module.exports = JSON.parse(
    process.env.APP_SETTINGS ||
    fs.readFileSync(`settings-${process.env.NODE_ENV}.json`, "utf-8") ||
    "{}"
);