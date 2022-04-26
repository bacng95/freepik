const express = require('express')
const app = express()
const port = process.env.PORT || 3000


const route = require('./route');
const middleware = require('./middleware')

const logger = require('./lib/logger')

try {
    middleware(app);
    route(app);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}\n\n`)
    })
} catch (error) {
    logger.error(error);
}