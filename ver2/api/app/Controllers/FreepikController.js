const freepik = require('../../lib/freepik')
const Database = require('../../lib/database')
const logger = require('../../lib/logger')

module.exports = class FreeePikController {
    async listItem (request, response) {
        try {
            let {page, type} = request.query
        
            const pageLimit = 30;
            
            if (!page) { page = 1 }
            if (!type) { type = 'new' }

            const itemListQuery = Database.table('freepik_item')
            .join('freepik_author', 'freepik_author.id', 'freepik_item.author_id')

            if (type) {
                if (type != 'new')
                    itemListQuery.where('type', type)
            }

            itemListQuery.orderBy('freepik_item.created_at', 'desc')
            .select('freepik_item.id', 'freepik_item.source', 'freepik_item.thumbnail', 'freepik_item.premium', 'freepik_item.item_id', 'freepik_item.title', 'freepik_author.id as author_id', 'freepik_author.avatar as author_avatar', 'freepik_author.link as author_link')
            .offset(page == 1 ? 0 : page * pageLimit, pageLimit)

            const itemList = await itemListQuery

            return response.json({
                code: 1,
                data: itemList
            })
        } catch (error) {
            logger.error(error, 'FreepikController.listItem')
            return response.json({
                code: 0,
                data: error.message
            })
        }
    }

    async getLinkDownLoad (req, res) {
        try {
            const link = req.query.link

            if (link) {
                const linkDownload = await freepik.getLinkDownload(link)
    
                if (linkDownload) {
                    return res.json({
                        code: 1,
                        data: linkDownload
                    })
                } else {
                    return res.json({
                        code: 0,
                        msg: 'Out of serivce'
                    })
                }
            }

            return res.json({
                code: 0,
                msg: 'missing link param'
            })
        } catch (error) {
            return res.json({
                code: 0,
                msg: error.message
            })
        }

    }
}