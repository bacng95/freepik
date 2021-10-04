'use strict'

const axios = use('axios')
const Database = use('Database');
const FormData = require('form-data');
const crypto = require('crypto');

class FreepikController {

    async Logs(action_id, action_name) {
        const type = "freepik";
        await Database.table('system_logs')
        .insert({
            type,
            action_name,
            data: action_id
        })
    }

    async refreshCsrfToken () {
        try {
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
                }
            })
            this._mergeCookie(this._parseCookieBrower(resp.headers['set-cookie']), cookie)
            await this._setCookie(cookie)
            console.log('Refresh done !')
        } catch (error) {
            console.log('refresh csrf token: ', 'fail')
        }
    }

    async getLinkAction({request, response}) {
        const { url } = request.all()

        let link = '';

        try {
            link = await this.getLink(url)
        } catch (error) {
            console.log('getLink: ', 'fail')
        }

        // Check with captcha
        
        if ( typeof link === "string" && link.indexOf('download') != -1) {
            const token = await this.init2Captcha(url)
            link = await this.getLink(url, token)
        }

        // // Challenge 2
        // if ( typeof link === "string" && link.indexOf('download') != -1) {
        //     link = await this.getLink(link, true)
        // }

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
            // itemId = link.toString().replace('.htm', '')
            itemId = link.toString().split('_')
            itemId = itemId[itemId.length - 1]
            itemId = itemId.split('.')
            itemId = itemId[0]
        }

        return itemId
    }

    async goingWebsite (url) {
        const itemId = this._linkToId(url)
        let cookie = await this._getCookie()

        // Load trang
        await axios.get('https://www.freepik.com/home', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'upgrade-insecure-requests': 1,
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin'
            },
            maxRedirects: 0
        })

        // Gửi last failed payment
        await axios.get('https://www.freepik.com/xhr/user/last-failed-payment', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': 'https://www.freepik.com/home',
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })


        // Gửi Follow
        await axios.get('https://www.freepik.com/xhr/user/collection/followed', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': 'https://www.freepik.com/home',
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })

        // Lấy detail
        const itemDetailt = await axios.get(`https://www.freepik.com/xhr/detail/${itemId}`, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': url,
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })

        // Follow Author
        await axios.get(`https://www.freepik.com/xhr/user/follow/?author=${itemDetailt.data.data.detail.author.userId}`, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': url,
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })

        this._mergeCookie(this._parseCookieBrower(itemDetailt.headers['set-cookie']), cookie)
        await this._setCookie(cookie)

        return itemDetailt.data.data.detail
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

    async getDetail(url) {
        const itemId = this._linkToId(url)
        let cookie = await this._getCookie()

         // Lấy detail
        const itemDetailt = await axios.get(`https://www.freepik.com/xhr/detail/${itemId}`, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': url,
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-csrf-token': cookie['csrf_freepik'],
                'x-requested-with': 'XMLHttpRequest'
            },
            maxRedirects: 0
        })

        this._mergeCookie(this._parseCookieBrower(itemDetailt.headers['set-cookie']), cookie)
        await this._setCookie(cookie)

        return itemDetailt.data.data.detail
    }

    async wait2CaptchaToken(id) {
        return await new Promise(resolve => {
            let captchaLoop = 20
            const interval = setInterval(async () => {
                let captchaResult = await axios.get(`http://2captcha.com/res.php`, {
                    params: {
                        key: '249c6ca0dcc6121f3a128072851e7266',
                        action: 'get',
                        id: id,
                        json: 1
                    },
                })

                if (captchaResult.data.status == 1) {
                    resolve(captchaResult.data.request)
                    console.log(id + ': get token - ' + captchaResult.data.request)
                    clearInterval(interval);
                }

                if (captchaLoop < 0) {
                    clearInterval(interval);
                    resolve('')
                    console.log(id + ': get token failt')
                }
                captchaLoop--;
            }, 2000);
        });
    }

    async init2Captcha(url) {
        console.log('init Captcha')
        let token = '';
        const captcha = await axios.get(`http://2captcha.com/in.php`, {
            params: {
                key: '249c6ca0dcc6121f3a128072851e7266',
                method: 'userrecaptcha',
                googlekey: '6LfEmSMUAAAAAEDmOgt1G7o7c53duZH2xL_TXckC',
                pageurl: url,
                json: 1
            },
        })

        if (captcha.data.status == 1) {
            // return captcha.data.request
            console.log(captcha.data.request + ': wait return token')
            // Test captcha Loop 
            token = await this.wait2CaptchaToken(captcha.data.request)

        }
        return token
    }


    async sendPointGG(url, item_detail) {
        let cookie = await this._getCookie()
        const id = this._linkToId(url)
        const userPremium = 1
        const userEssential = item_detail.is_essential
        const position = 0
        const exclusive = 0
        const userid = 29936080
        const format = 'category'
        const ga_client_id = cookie['_ga']
        const r = parseFloat(this._getRandomArbitrary(0.4399444398590271, 0.9444651633182548).toFixed(16))

        console.log(r)

        const itemDetailt = await axios.get('https://www.freepik.com/download.gif', {
            params: {
                id,
                userPremium,
                userEssential,
                position,
                exclusive,
                userid,
                format,
                ga_client_id,
                r
            },
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.148 Safari/537.36',
                'referer': url,
                'cookie': this._cookieObjectToString(cookie),
                'accept-encoding': 'gzip, deflate, br',
                'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'same-origin',
            }
        })
    }

    _getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    async getLink(link, token = '') {
        const itemId = this._linkToId(link)
        if (itemId) {

            // await this.Logs(itemId, 'Bắt đầu get link - ' + challenge ? '1' : '0')
            
            let cookie = await this._getCookie()

            // truy cap website

            const itemDetail = await this.getDetail(link)
        
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

            try {
                let resp3 = await axios.get(`https://www.freepik.com/download-file/${itemId}?is_premium_item=1&is_premium_user=1&token=${token}`, {
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
                console.log('getLink: ', error)
                this._mergeCookie(this._parseCookieBrower(error.response.headers['set-cookie']), cookie)
                await this._setCookie(cookie)

                // Send event
                await this._sendEvent(link, itemId)

                // Send point gooogle

                await this.sendPointGG(link, itemDetail)
                
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

    generateBoundary(){
        const alphaNumericEncodingMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789AB'; //yes I know, "AB" appears twice
        let boundary = "----WebKitFormBoundary";
        for (var i = 0; i < 4; ++i) {
            var randomness = crypto.randomBytes(4);
            boundary += alphaNumericEncodingMap[randomness[3] & 0x3F]; //wasting bits makes me sad... but whatever
            boundary += alphaNumericEncodingMap[randomness[2] & 0x3F];
            boundary += alphaNumericEncodingMap[randomness[1] & 0x3F];
            boundary += alphaNumericEncodingMap[randomness[0] & 0x3F];
        }
        return boundary;
    }

    async _sendEvent (link, item_id) {

        try {
            
            await this.Logs(item_id, 'Send event')

            let form = new FormData();
            form._boundary = this.generateBoundary();
            form.append('category', 'detail-modal')
            form.append('action', 'premium-download')
            form.append('label', parseInt(item_id))

            let cookie = await this._getCookie()
            // console.log(form._boundary)
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
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`
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
