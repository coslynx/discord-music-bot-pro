import { Client, Message } from 'discord.js';
import { CommandHandler } from '../utils/commandHandler';

const commandHandler = new CommandHandler();

export const onMessageCreate = async (client: Client, message: Message) => {
  try {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if the message starts with the bot's prefix
    if (message.content.startsWith(process.env.PREFIX)) {
      // Handle command interaction
      await commandHandler.handleMessageCommand(client, message);
    }
  } catch (error) {
    // Handle errors during message processing
    console.error('Error handling message:', error);
  }
};