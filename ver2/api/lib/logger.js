'use strict';
const Database = require('./database');

class Logger {
    isErrorObject(value) {
        return value && value instanceof Error;
    }

    getErrorMessage(value) {
        const isErrorObject = this.isErrorObject(value);

        if (isErrorObject) {
            return value?.message || value?.reason || value;
        }

        return value;
    }

    log(message = '') {
        if (message) {
            console.log(`${message}`);
        }
    }

    info(message, method = '') {
        this.log(`[INFO] - ${method} : ${this.getErrorMessage(message)}`)
        this.externalHandel(message, method, 'info');
    }

    success(message, method = '') {
        this.log(`[SUCCESS] - ${method} : ${this.getErrorMessage(message)}`)
        this.externalHandel(message, method, 'success');
    }

    warn(message, method = '') {
        this.log(`[WARN] - ${method} : ${this.getErrorMessage(message)}`)
        this.externalHandel(message, method, 'warn');
    }

    error(message, method = '') {
        this.log(`[ERROR] - ${method} : ${this.getErrorMessage(message)}`)
        this.externalHandel(message, method, 'error');
    }

    externalHandel(message, method, level) {
        Database.table('system_log').insert({
            action: method,
            data: this.getErrorMessage(message),
            level
        })
    }
}

module.exports = new Logger();