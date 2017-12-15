'use strict';


const _loggers = new Map();

/**
 * Just a simple logger.
 * The available log levels are: INFO, DEBUG, WARN, ERROR
 * @class Logger
 * @param {Object} options
 * @param {Number} [options.logLevel=Logger.LOG_LEVELS.WARN] - Must be one of Logger.LOG_LEVELS.
 * @param {String} [options.name='Logger'] - Name of the logger
 */
class Logger {

    constructor(options = {}) {
        const {
            logLevel = Logger.LOG_LEVELS.WARN,
            name = 'Logger'
        } = options;

        // Check parameters
        if (typeof logLevel === 'string')
            logLevel = Logger._getLogLevelFromString(logLevel);
        this._logLevel = logLevel;
        this._name = name;

        const logger = _loggers.get(name);
        if (logger) {
            if (logger.logLevel != logLevel)
                console.warn(`Logger '${name}' requested with new level=${logLevel}, still using the old level='${logger.logLevel}'`);
            return logger;
        }
        _loggers.set(name, this);
    }

    /**
     * It returns the Logger instance with the specified name
     * @param {String} name - Logger name
     */
    static getLogger(name) {
        const logger = _loggers.get(name);
        if (logger)
            return logger;
        throw new Error(`Logger ${name} not found`);
    }

    static get LOG_LEVELS() {
        return {
            INFO: 0,
            DEBUG: 1,
            WARN: 2,
            ERROR: 3
        }
    }

    /**
     * Call Logger.write with logLevel = Logger.LOG_LEVELS.INFO
     * @param {String} file
     * @param {String} method 
     * @param {String} msg 
     * @param {String|Object} output - If it's an Object it will be stringified
     */
    i(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.INFO, file, method, msg, output);
    }

    /**
     * Call Logger.write with logLevel = Logger.LOG_LEVELS.DEBUG
     * @param {String} file
     * @param {String} method 
     * @param {String} msg 
     * @param {String|Object} output - If it's an Object it will be stringified
     */
    d(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.DEBUG, file, method, msg, output);
    }

    /**
     * Call Logger.write with logLevel = Logger.LOG_LEVELS.WARN
     * @param {String} file
     * @param {String} method 
     * @param {String} msg 
     * @param {String|Object} output - If it's an Object it will be stringified
     */
    w(file, method, msg, output) {
        this.write(Logger.LOG_LEVELS.WARN, file, method, msg, output);
    }

    /**
     * Call Logger.write with logLevel = Logger.LOG_LEVELS.ERROR
     * @param {String} file
     * @param {String} method 
     * @param {String} msg 
     * @param {String|Object} output - If it's an Object it will be stringified
     */
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

    /**
     * It prints a log to the console
     * @param {Number} logLevel - Must be one of Logger.LOG_LEVELS
     * @param {String} file
     * @param {String} method 
     * @param {String} msg 
     * @param {String|Object} output - If it's an Object it will be stringified
     */
    write(logLevel, file, method, msg, output) {
        if (typeof logLevel === 'string')
            logLevel = Logger._getLogLevelFromString(logLevel);
        if (logLevel < this._logLevel)
            return;

        const date = new Date().toJSON();
        let logMessage = `${date} - [${Logger._logLevelToString(logLevel)}] - ${this._name} - ${file}`;
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

module.exports = Logger;