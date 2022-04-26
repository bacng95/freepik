const axios = require('axios');

const axiosIns = axios.create({
    baseURL: 'https://www.freepik.com/xhr',
    timeout: 10000,
    headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        'accept-encoding': 'gzip, deflate, br',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest'
    },
    maxRedirects: 0
})

// axios.default.interceptors.request.use((config) => {
//     config.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/99.0.98 Chrome/93.0.4577.98 Safari/537.36',
//     config.headers['referer'] = 'https://www.freepik.com/home';
//     config.headers['accept-encoding'] = 'gzip, deflate, br';
//     config.headers['accept'] = 'application/json, text/plain, */*'
//     config.headers['accept-language'] = 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5';
//     config.headers['sec-fetch-dest'] = 'empty';
//     config.headers['sec-fetch-mode'] = 'cors';
//     config.headers['sec-fetch-site'] = 'same-origin';
//     config.headers['x-requested-with'] = 'XMLHttpRequest';

//     config.maxRedirects = 0;
// })



module.exports = axiosIns