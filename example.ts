import telegramBot from "./untils/telegramBot";
import { errorLog, } from "./untils";

console.log('\x1b[35m%s\x1b[0m', 'Started telegram bot!');

telegramBot().then();
errorLog('***** Started server! *****');
