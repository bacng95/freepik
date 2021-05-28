'use strict'

const axios = use('axios')
const Database = use('Database');
const FormData = require('form-data');

class FreepikController {

    async refreshCsrfToken () {
        let cookie = await this._getCookie()
        
        let resp = await axios.get('https://www.freepik.com/home', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'upgrade-insecure-requests': 1,
                'referer': '',
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })
        this._mergeCookie(this._parseCookieBrower(resp.headers['set-cookie']), cookie)
        await this._setCookie(cookie)
        console.log('Refresh done !')
    }

    async getLinkAction({request, response}) {
        const { url } = request.all()

        let link = await this.getLink(url)

        // Challenge 1
        if ( typeof link === "string" && link.indexOf('download-file') != -1) {
            link = await this.getLink(link, true)
        }

        // Challenge 2
        if ( typeof link === "string" && link.indexOf('download-file') != -1) {
            link = await this.getLink(link, true)
        }

        if (typeof link === "object") {
            return response.json({
                code: 1,
                message: 'Ngon rồi đại ca !',
                data: link
            })
        } else {
            return response.json({
                code: 0,
                message: 'Có biến rồi đại ca ơi !',
            })
        }
    }

    _linkToId(link, challenge) {
        let itemId = ''
        if (link && link != '') {
            itemId = link.toString().replace('.htm', '')
            itemId = challenge ? itemId.split('/') : itemId.split('_')
            itemId = itemId[itemId.length - 1]
        }

        return itemId
    }

    async getInfoAccount({request, response}) {
        let cookie = await this._getCookie()

        let resp = await axios.get('https://www.freepik.com/xhr/validate', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'upgrade-insecure-requests': 1,
                'referer': 'https://www.freepik.com/premium-psd/blank-photo-frame-mockup-design_13817478.htm',
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })

        this._mergeCookie(this._parseCookieBrower(resp.headers['set-cookie']), cookie)
        await this._setCookie(cookie)

        return response.json({
            code: 1,
            message: 'Ngon rồi đại ca!',
            data: resp.data
        })
    }

    async getLink(link, challenge) {
        const itemId = this._linkToId(link, challenge)
        if (itemId) {
            let cookie = await this._getCookie()
        
            let resp = await axios.get(`https://www.freepik.com/xhr/register-download/${itemId}`, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                    'upgrade-insecure-requests': 1,
                    'referer': link,
                    'cookie': this._cookieObjectToString(cookie),
                    'accept-encoding': 'gzip, deflate, br',
                    'x-csrf-token': cookie['csrf_freepik'],
                    'x-requested-with': 'XMLHttpRequest'
                },
                maxRedirects: 0
            })
    
            this._mergeCookie(this._parseCookieBrower(resp.headers['set-cookie']), cookie)
            await this._setCookie(cookie)

            let resp2 = await axios.get('https://www.freepik.com/xhr/validate', {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                    'upgrade-insecure-requests': 1,
                    'referer': link,
                    'cookie': this._cookieObjectToString(cookie),
                    'accept-encoding': 'gzip, deflate, br',
                    'x-csrf-token': cookie['csrf_freepik'],
                    'x-requested-with': 'XMLHttpRequest'
                },
                maxRedirects: 0
            })

            this._mergeCookie(this._parseCookieBrower(resp2.headers['set-cookie']), cookie)
            await this._setCookie(cookie)
            
            await this._sendEvent(link, itemId)

            try {
                let resp3 = await axios.get(`https://www.freepik.com/download-file/${itemId}?is_premium_item=0&is_premium_user=1`, {
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                        'upgrade-insecure-requests': 1,
                        'referer': link,
                        'cookie': this._cookieObjectToString(cookie),
                        'accept-encoding': 'gzip, deflate, br',
                        'x-csrf-token': cookie['csrf_freepik'],
                        'x-requested-with': 'XMLHttpRequest'
                    },
                    maxRedirects: 0
                })
    
                this._mergeCookie(this._parseCookieBrower(resp3.headers['set-cookie']), cookie)
                await this._setCookie(cookie)
                
                return '';
            } catch (error) {
    
                this._mergeCookie(this._parseCookieBrower(error.response.headers['set-cookie']), cookie)
                await this._setCookie(cookie)
    
                if ( error.response.headers.location.indexOf('/download/') != -1) {
                    return error.response.headers.location
                }
    
                return {
                    link: error.response.headers.location,
                    account: resp2.data
                }
            }
        }
        
    }

    async _sendEvent (link, item_id) {

        try {
            let form = new FormData();
            form.append('category', 'detail-modal')
            form.append('action', 'premium-download')
            form.append('label', item_id)

            let cookie = await this._getCookie()
            let resp = await axios.post('https://www.freepik.com/xhr/events/send', form,
            {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                    'upgrade-insecure-requests': 1,
                    'referer': link,
                    'origin': 'https://www.freepik.com',
                    'cookie': this._cookieObjectToString(cookie),
                    'accept-encoding': 'gzip, deflate, br',
                    'x-csrf-token': cookie['csrf_freepik'],
                    'x-requested-with': 'XMLHttpRequest',
                    'content-type': 'multipart/form-data'
                },
                maxRedirects: 0
            })

            this._mergeCookie(this._parseCookieBrower(resp.headers['set-cookie']), cookie)
            await this._setCookie(cookie)
        } catch (error) {
            console.log(error.message)
        }
    }

    _cookieObjectToString(cookie) {
        let _cookie = ''
        if (typeof cookie === "object") {
            Object.keys(cookie).forEach(function(key) {
                _cookie += `${key}=${cookie[key]}; `
            });
        }

        return _cookie
    }

    _csrfCookie(cookieString) {
        if (cookieString.indexOf('csrf_freepik')) {
            let csrf = cookieString.split(';')[0]
            csrf = csrf.split('=')[0]
            return `csrf_freepik=${csrf}`
        }
        return ''
    }

    _mergeCookie(cookie, CookieObject) {
        Object.keys(cookie).forEach(function(key1) {
            // CookieObject[key] = 
            let check = false;
            Object.keys(CookieObject).forEach(function(key2) {
                if (key1 == key2) {
                    CookieObject[key2] = cookie[key1]
                    check = true
                }
            });

            if (!check) {
                CookieObject[key1] = cookie[key1]
            }

        });
    }

    
    async _setCookie(cookie) {
        let _cookie = ''
        if (typeof cookie === "object") {
            Object.keys(cookie).forEach(function(key) {
                _cookie += `${key}=${cookie[key]}; `
            });
        }
        let cookieSaveStage = await Database.table('settings')
        .where('meta_key', 'freepik_cookie')
        .update({
            'data': _cookie
        })

        if (cookieSaveStage) {
            return true
        }
        return false
    }

    async _getCookie() {
        const CookieSetting = await Database.table('settings')
        .where('meta_key', 'freepik_cookie')
        .first()

        if (CookieSetting && CookieSetting.data) {
            return this._parseCookies(CookieSetting.data)
        }

        return {}
    }

    _parseCookieBrower(cookie) {
        let _cookie = {}
        cookie.forEach(element => {
            let cookieItem = element.split(';')[0]
            cookieItem = cookieItem.split('=')
            _cookie[cookieItem[0]] = cookieItem[1]
        });

        return _cookie
    }

    _parseCookies (cookieString) {
        var list = {}
    
        cookieString && cookieString.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            if (parts[0] !== '' && parts[0] !== ' ')
                list[parts.shift().trim()] = parts.join('=');
        });
    
        return list;
    }
}

module.exports = FreepikController
