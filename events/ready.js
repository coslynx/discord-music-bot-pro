import { Client } from 'discord.js';
import { registerCommands } from '../utils/commandHandler';
import { logger } from '../utils/logger';
import { QueueService } from '../services/queueService';
import { GuildService } from '../services/guildService';

const queueService = new QueueService();
const guildService = new GuildService();

export const onReady = async (client: Client) => {
  try {
    // Log that the bot is ready
    logger.info(`[${client.user.tag}] Bot is ready!`);

    // Register all slash commands
    await registerCommands(client);

    // Load guild settings from the database
    const guilds = await guildService.getAllGuilds();
    guilds.forEach((guild) => {
      queueService.createQueue(guild.id); // Initialize queues for existing guilds
    });

    // Perform any other initialization tasks here
  } catch (error) {
    logger.error(`Error during bot initialization: ${error.message}`);
    // Handle any errors during initialization
  }
};