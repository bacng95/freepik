const bodyParser = require('body-parser');

module.exports = (req, res, next) => {
    const contentType = req.headers['content-type'];

    if (contentType && contentType === 'application/x-www-form-urlencoded') {
        return bodyParser.urlencoded({
            extended: true
        })(req, res, next);
    }

    return bodyParser.json()(req, res, next);
}