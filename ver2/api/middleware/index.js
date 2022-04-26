const compression = require('compression');
const cookieParser = require('cookie-parser');

const requestMethods = require('./requestMethods');
const cors = require('./cors');
const bodyParser = require('./bodyParser');

module.exports = (app) => {
    app.use(requestMethods);
    app.use(compression());
    app.use(cors);
    app.use(bodyParser);
    app.use(cookieParser());
}