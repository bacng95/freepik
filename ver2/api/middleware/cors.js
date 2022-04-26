const cors = require("cors");
const settings = require("../lib/setting");

const urlsAllowedToAccess =
    Object.entries(settings.urls || {}).map(([key, value]) => value) || [];

module.exports = configuration = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || urlsAllowedToAccess.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`${origin} not permitted by CORS policy.`));
        }
    },
};

module.exports = (req, res, next) => {
    return cors(configuration)(req, res, next);
};