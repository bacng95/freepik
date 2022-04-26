const cookie = require('./cookie');
const Database = require('../lib/database');
const axios = require('../lib/axios');
const logger = require('../lib/logger');

module.exports = {

    async lastFailedPayment (url, account_id, requestId) {
        const requestData = await this.request('https://www.freepik.com/xhr/user/last-failed-payment', null, url, account_id, requestId)
        return requestData
    },


    async registerDownload (url, account_id, requestId) {
        const linkId = this.linkToId(url)
        const requestData = await this.request(`https://www.freepik.com/xhr/register-download/${linkId}`, null, url, account_id, requestId)
        return requestData
    },


    async validate(url, account_id, requestId) {
        const requestData = await this.request(`https://www.freepik.com/xhr/validate`, null, url, account_id, requestId)
        return requestData
    },


    async downloadUrl(url, account_id, requestId) {
        const linkId = this.linkToId(url)
        const requestData = await this.request(`https://www.freepik.com/xhr/download-url/${linkId}`, null, url, account_id, requestId)
        return requestData
    },

    async assetDetail(url) {
        const linkId = this.linkToId(url)
        const requestData = await this.requestNoCookie(`https://www.freepik.com/xhr/detail/${linkId}`, url)
        return requestData.data
    },

    itemIsPremium (link) {
        let category = link.split('/')
        for (let index = 0; index < category.length; index++) {
            const element = category[index];
            if ((element.indexOf("premium") != -1 || element.indexOf("free") != -1) && element.indexOf("www") == -1) {
                if (element.indexOf("premium") != -1) 
                    return true;
                else 
                    return false;
            }
        }
    },

    typeOfItem (link) {
        let category = link.split('/')
        for (let index = 0; index < category.length; index++) {
            const element = category[index];
            if ((element.indexOf("premium") != -1 || element.indexOf("free") != -1) && element.indexOf("www") == -1) {
                const _typeString = element.split('-')
                return _typeString[1]
            }
        }

        return false
    },

    async storeAuthor (author) {
        const authorCheck = await Database.table('freepik_author')
        .where('id', author?.id)
        .first();

        if (!authorCheck) {
            await Database.table('freepik_author')
            .insert({
                id: author?.id,
                avatar: author?.avatar,
                link: author?.link
            })

            return true
        }
        return false
    },

    async getFreePikItemOfStore (url) {
        try {
            const linkId = this.linkToId(url)
            return await Database.table('freepik_item')
            .where('item_id', linkId)
            .first()
        } catch (error) {
            logger.error(error, 'freepik.getFreePikItemOfStore')
        }
    },

    async storeKeywords (itemId, type, keywords) {
        if (keywords.length) {
            for (let index = 0; index < keywords.length; index++) {
                const element = keywords[index];
                const checkKeyword = await Database.table('freepik_keywords')
                .where('slug', element.s)
                .first()

                let keywordId = -1;
                if (!checkKeyword) {
                    const insertKeyword = await Database.table('freepik_keywords')
                    .insert({
                        name: element.n,
                        slug: element.s,
                        type
                    })

                    keywordId = insertKeyword[0]
                } else {
                    keywordId = checkKeyword.id
                }

                try {
                    // insert map
                    await Database.table('freepik_keywords_item')
                    .insert({
                        item_id: itemId,
                        keyword_id: keywordId
                    })
                } catch (error) {
                    logger.error(error, 'freepik.storeKeywords.insertMap')
                }
            }
        }
    },

    async storeItem (url) {

        try {
            const linkId = this.linkToId(url)

            const preepikItem = await this.getFreePikItemOfStore(url)
            if (!preepikItem) {

                let detail = await this.assetDetail(url)
                detail = detail.detail
                this.storeAuthor(detail?.author)

                const itemId = await Database.table('freepik_item')
                .insert({
                    source: url,
                    item_id: linkId,
                    thumbnail: detail?.thumbnails?.small,
                    premium: this.itemIsPremium(url),
                    title: detail.title,
                    author_id: detail?.author?.id,
                    type: this.typeOfItem(url),
                    created_at: detail?.creation?.date || null
                })

                this.storeKeywords(itemId[0], this.typeOfItem(url), detail?.keywords)

                return {
                    thumbnail: detail?.thumbnails?.small,
                    title: detail.title
                };
            }
            
            return {
                thumbnail: preepikItem.thumbnail,
                title: preepikItem.title
            };
        } catch (error) {
            logger.error(error, 'freepik.storeItem')
            return false
        }
    },
    
    async requestNoCookie (url, referer = false) {
        try {
            const _response = await axios.get(url, {
                headers: {
                    'referer': referer || '/'
                }
            })

            return _response.data
        } catch (error) {
            logger.error(error, 'freepik.requestNoCookie')
            return {}
        }
    },



    async request (url, params, referer, accountId, requestId) {
        try {
            let CookieData = await cookie.getCookie(accountId)
        
            const _response = await axios.get(url, {
                headers: {
                    'cookie': cookie.cookieObjectToString(CookieData),
                    'x-csrf-token': CookieData['csrf_freepik'],
                    'referer': referer
                }
            })

            if (_response.headers['set-cookie']) {
                const browserCookie = cookie.parseCookieBrower(_response.headers['set-cookie'])
                const CookieWrap = cookie.mergeCookie(browserCookie, CookieData)
                // SaveCookie
                await cookie.setCookie(accountId, CookieWrap)
            }

            this.storeRequestData(url, requestId, _response.data)

            return _response.data
        } catch (error) {
            logger.error(error, 'freepik.request')
            return {}
        }
    },


    async getLinkDownload (link) {
        if (link) {

            const itemStore = await this.storeItem(link)

            const linkHistory = await this.getLinkInHistory(link)
            if (linkHistory) {
                return {
                    url : linkHistory.download_link,
                    thumbnail: itemStore.thumbnail,
                    title: itemStore.title
                }
            }

            const freepikAccount = await this.chooseAccount();
            if (freepikAccount) {
                
                const accountId = freepikAccount.id
                const requestId = await this.createHistory(link)
                
                const lastFailedPaymentResponse= await this.lastFailedPayment(link, accountId, requestId)
                const registerDownloadResponse = await this.registerDownload(link, accountId, requestId)
                const validateResponse = await this.validate(link, accountId, requestId)
                const downloadUrlResponse = await this.downloadUrl(link, accountId, requestId)

                await this.updateAccount(accountId, validateResponse)
                await this.updateHistory(requestId, downloadUrlResponse)

                return {
                    url : downloadUrlResponse.url,
                    thumbnail: itemStore.thumbnail,
                    title: itemStore.title
                }
            }
        }
        return false
    },

    async getLinkInHistory (link) {
        const itemId = this.linkToId(link)

        const history = await Database.table('history')
        .where('item_id', itemId)
        .where('status', 1)
        .where(function() {
            this.where('link_expiry', '>', new Date().getTime()/1000).orWhereNotNull('file_store')
        })
        .first();

        return history;
    },

    async createHistory (link, user_id = 9999999) {
        try {
            const historyId = await Database.table('history')
            .insert({
                user_id,
                link,
                item_id: this.linkToId(link),
            })
            
            return historyId[0]
        } catch (error) {
            logger.error(error, 'FreepikController.createHistory')
            return false
        }
    },

    async chooseAccount () {
        let accountList = await Database.table('freepik_account')
        .where('status', 1)
        .orderBy('download_available', 'asc')

        for (let index = 0; index < accountList.length; index++) {
            const element = accountList[index];
            if ((element.download_available < element.download_limit) || (new Date(element.time_update_dowload) < new Date())) {
                return element
            }
        }
        return false;
    },

    linkdownloadGetExpiresTime(link) {
        const indexOfExpires = link.indexOf('exp=');
        if (indexOfExpires > 0 && indexOfExpires != -1) {
            return link.substring(link.indexOf('exp=') + 4, link.indexOf('exp=') + 14)
        }

        return null
    },


    async updateAccount(accountId, data) {
        if (data?.countDownloads) {
            const timeNow = new Date();
            await Database.table('freepik_account')
            .where('id', accountId)
            .update({
                download_available: data.countDownloads,
                download_limit: data.limitDownloads,
                time_update_dowload: `${timeNow.getFullYear()}-${(timeNow.getMonth()+1) < 10 ? '0'+ (timeNow.getMonth()+1) : (timeNow.getMonth()+1)}-${timeNow.getDate() < 10 ? '0'+ timeNow.getDate() : timeNow.getDate()} `
            })
        }
    },

    async updateHistory (requestId, data) {
        if (data?.code == 200 && data?.success) {
            await Database.table('history')
            .where('id', requestId)
            .update({
                download_link: data?.url,
                file_name: data?.filename,
                status: 1,
                link_expiry: this.linkdownloadGetExpiresTime(data.url)
            })
            return true
        }
        
        await Database.table('history')
        .where('id', requestId)
        .update({
            status: 2
        })
        return false
    },


    async storeRequestData (link, requestId, data) {
        return await Database.table('request_log')
        .insert({
            request_id: requestId,
            link,
            data: JSON.stringify(data)
        })
    },


    refreshCsrfToken () {
        try {
            
        } catch (error) {
            logger.error(error, 'freepik.refreshCsrfToken');
        }
    },


    linkToId (link) {
        let itemId = ''
        if (link && link != '') {
            itemId = link.toString().split('#')
            itemId = itemId[0].toString().split('_')
            itemId = itemId[itemId.length - 1]
            itemId = itemId.split('.')
            itemId = itemId[0]
        }

        return itemId
    }
}