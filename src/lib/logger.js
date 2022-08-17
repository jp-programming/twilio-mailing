const { pino } = require('pino');

const transport = {
    target: 'pino-pretty',
    options: {
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
    }
};

const buildInfoLogger = () => {
    const infoLogger = pino({ transport });
    infoLogger.level = 'info';
    return infoLogger;
};

const buildWarnLogger = () => {
    const warnLogger = pino('./logs/warn.log');
    warnLogger.level = 'warn';
    return warnLogger;
}

const buildErrorLogger = () => {
    const errorLogger = pino('./logs/error.log');
    errorLogger.level = 'error';
    return errorLogger;
}

const logger = (level, message) => {
    if(level === 'warn') {
        return buildWarnLogger().warn(message);
    } else if(level === 'error') {
        return buildErrorLogger().error(message);
    } else {
        return buildInfoLogger().info(message);
    }
};

module.exports = logger;