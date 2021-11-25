import config from '../config/config';
import { sendLogMessage, } from './telegramBot';

/**
 * Get pm2 id from server.
 */
export const getServerId = (): number | void => {
    switch (config.baseUrl) {
        case 'https://mainYourSite.tech': return 4;
        case 'https://staging-yourSite.tech': return 3;
        case 'https://develop-yourSite.tech': return 2;
        default:
    }
};

export function errorLog(message: string, ...params: any[]): void {
    console.error(message, ...params);
    sendLogMessage(message);
}
