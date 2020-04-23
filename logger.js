const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `- ${timestamp} [${level}] -> ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    // label({ label: 'label' }),
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `info.log`
    //
    new transports.File({filename: 'error.log', level: 'error'}),
    new transports.File({filename: 'info.log'}),
    new transports.Console()
  ]
});

module.exports = logger;