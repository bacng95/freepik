const cookie = require('./lib/cookie')
const Freepik = new (require('./app/Controllers/FreepikController'))

const prefix = '/api'
module.exports = (app) => {
    
    app.get(`${prefix}/download`, Freepik.getLinkDownLoad)

    app.get(`${prefix}/home/items`, Freepik.listItem)

    
    app.get('*', async (req, res) => {
        return res.send('U noooo')
    })
}