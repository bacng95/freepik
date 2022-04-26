const Database = require('./database')
const logger = require('./logger')

module.exports = {
    async getCookie (account_id) {
        try {
            if (account_id) {
                const cookieSetting = await Database.table('freepik_account')
                .where('id', account_id)
                .first();
    
                if (cookieSetting && cookieSetting.data) {
                    return this.parserCookies(cookieSetting.data)
                }
            }

            return {};
            
        } catch (error) {
            logger.error(error, 'cookie.getCookie');
        }
    },
    parseCookieBrower(cookie) {
        let _cookie = {}
        cookie.forEach(element => {
            let cookieItem = element.split(';')[0]
            cookieItem = cookieItem.split('=')
            _cookie[cookieItem[0]] = cookieItem[1]
        });

        return _cookie
    },
    async setCookie (account_id, cookie) {
        try {
            if (account_id) {
                
                const _cookieString = this.cookieObjectToString(cookie)

                let cookieSaveState = await Database.table('freepik_account')
                .where('id', account_id)
                .update({
                    data: _cookieString
                })

                if (cookieSaveState) {
                    return true
                }
            }

            return false
        } catch (error) {
            logger.error(error, 'cookie.setCookie');
        }
    },
    mergeCookie (cookie_1, cookie_2) {
        try {
            return Object.assign({}, cookie_1, cookie_2)
        } catch (error) {
            logger.error(error, 'cookie.mergeCookie');
        }
    },
    parserCookies (cookieString) {
        let list = {}

        cookieString && cookieString.split(';').forEach((cookie) => {
            let part = cookie.split(';');
            part = part[0].split('=')
            list[part[0].replace(' ', '')] = part[1];
        })
        
        return list;
    },
    cookieObjectToString(cookie) {
        let _cookie = ''
        if (typeof cookie === "object") {
            Object.keys(cookie).forEach(function(key) {
                _cookie += `${key}=${cookie[key]}; `
            });
        }

        return _cookie
    }
}