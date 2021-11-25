import { exec, } from 'child_process';
import { isLocal, telegramBotToken, telegramChatIds, } from '../config/constant';
import { errorLog, getServerId, } from './index';

const TelegramBot = require('node-telegram-bot-api');

const botCommands = ['/commands', '/chatId'];
const servCommands = ['/start', '/stop', '/restart'];
const bot = isLocal ? null : new TelegramBot(telegramBotToken, { polling: true, });

export const serverCommand = async (chatId: number, userName: string, command: string):
  Promise<void> => {
  if (!telegramChatIds.includes(chatId)) {
    await bot.sendMessage(chatId, `${userName}, You're not authorized to execute this command.`);
    return;
  }

  const serverId = getServerId();

  if (serverId) {
    exec(`pm2 ${command.slice(1)} ${serverId}`, async (err, call) => {
      err && errorLog(`Error cannot ${command} server!`, err);
      call && await bot.sendMessage(chatId, `${command} command executed by: ${userName}.`);
    });
  }
  else {
    await bot.sendMessage(chatId, `Cannot find Server ID.`);
  }
};

export const sendLogMessage = async (text: string): Promise<void> => {
  if (!bot) {
    return;
  }

  for (const chatId of telegramChatIds) {
    await bot.sendMessage(chatId, text);
  }
};

export default async function (): Promise<void> {
  if (!bot) {
    return;
  }

  const commands = [...botCommands, ...servCommands];

  bot.on('message', ({ text, chat, }) => {
    !commands.includes(text) && bot.sendMessage(chat.id, 'Write /commands for bot commands.');
  });

  for (const command of commands) {
    bot.onText(new RegExp(command), ({ chat, from, }) => {
      if (botCommands.includes(command)) {
        const text = command === botCommands[0]
          ? `Choose one of the following:\n${commands.join('\r\n')}`
          : `Hello ${from.first_name}. Your Chat ID is: ${chat.id}`;
        bot.sendMessage(chat.id, text);
      }
      else {
        serverCommand(chat.id, from.first_name, command);
      }
    });
  }
}
