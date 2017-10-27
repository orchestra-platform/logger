'use strict';

module.exports = class Logger {

    constructor(logLevel) {
        if (!logLevel)
            logLevel = Logger.LOG_LEVELS.WARN;
        if (typeof logLevel === 'string')
            logLevel = Logger._getLogLevelFromString(logLevel);
        this._logLevel = logLevel;
    }

    static get LOG_LEVELS() {
        return {
            INFO: 0,
            DEBUG: 1,
            WARN: 2,
            ERROR: 3
        }
    }

    i(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.INFO, file, method, msg, output);
    }

    d(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.DEBUG, file, method, msg, output);
    }

    w(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.WARN, file, method, msg, output);
    }

    e(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.ERROR, file, method, msg, output);
    }

    static _getLogLevelFromString(logLevel) {
        logLevel = logLevel.toUpperCase();
        if (logLevel == 'WARNING')
            logLevel = 'WARN';
        if (Logger.LOG_LEVELS[logLevel] != undefined)
            return Logger.LOG_LEVELS[logLevel];
        return Logger.LOG_LEVELS.ERROR;
    }

    static _logLevelToString(logLevel) {
        const string = Object.keys(Logger.LOG_LEVELS)
            .find(l => Logger.LOG_LEVELS[l] == logLevel);
        return string.toUpperCase() || 'UNKNOW';
    }

    write(logLevel, file, method, msg, output) {
        if (typeof logLevel === 'string')
            logLevel = Logger._getLogLevelFromString(logLevel);
        if (logLevel < this._logLevel)
            return;

        const date = new Date().toJSON();
        let logMessage = `${date} - [${Logger._logLevelToString(logLevel)}] - ${file}`;
        if (method)
            logMessage += ' -> ' + method;
        if (msg)
            logMessage += ': ' + msg;

        let logFunction = console.log;
        switch (logLevel) {
            case Logger.LOG_LEVELS.INFO:
            case Logger.LOG_LEVELS.DEBUG:
                logFunction = console.log;
                break;
            case Logger.LOG_LEVELS.WARN:
                logFunction = console.warn;
                break;
            case Logger.LOG_LEVELS.ERROR:
                logFunction = console.error;
                break;
            default:
                logFunction = console.log;
                break;
        }
        logFunction(logMessage);
        if (output)
            logFunction('\t' + JSON.stringify(output))
    }

}