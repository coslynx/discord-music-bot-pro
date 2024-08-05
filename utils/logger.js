import winston from 'winston';
import { format } from 'winston';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Discord Music Bot' }),
    timestamp(),
    myFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        label({ label: 'Discord Music Bot' }),
        timestamp(),
        myFormat,
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production, log to the console.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}