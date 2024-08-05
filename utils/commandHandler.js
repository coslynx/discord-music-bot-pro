import { Client, Interaction, ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { playCommand, playHandler } from '../commands/play';
import { skipCommand, skipHandler } from '../commands/skip';
import { stopCommand, stopHandler } from '../commands/stop';
import { queueCommand, queueHandler } from '../commands/queue';
import { searchCommand, searchHandler } from '../commands/search';
import { nowPlayingCommand, nowPlayingHandler } from '../commands/nowPlaying';
import { repeatCommand, repeatHandler } from '../commands/repeat';
import { shuffleCommand, shuffleHandler } from '../commands/shuffle';
import { volumeCommand, volumeHandler } from '../commands/volume';
import { disconnectCommand, disconnectHandler } from '../commands/disconnect';
import { lyricsCommand, lyricsHandler } from '../commands/lyrics';
import { helpCommand, helpHandler } from '../commands/help';
import { settingsCommand, settingsHandler } from '../commands/settings';
import { logger } from './logger';

export class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.registerCommands();
  }

  registerCommands() {
    this.commands.set(playCommand.name, {
      command: playCommand,
      handler: playHandler,
    });
    this.commands.set(skipCommand.name, {
      command: skipCommand,
      handler: skipHandler,
    });
    this.commands.set(stopCommand.name, {
      command: stopCommand,
      handler: stopHandler,
    });
    this.commands.set(queueCommand.name, {
      command: queueCommand,
      handler: queueHandler,
    });
    this.commands.set(searchCommand.name, {
      command: searchCommand,
      handler: searchHandler,
    });
    this.commands.set(nowPlayingCommand.name, {
      command: nowPlayingCommand,
      handler: nowPlayingHandler,
    });
    this.commands.set(repeatCommand.name, {
      command: repeatCommand,
      handler: repeatHandler,
    });
    this.commands.set(shuffleCommand.name, {
      command: shuffleCommand,
      handler: shuffleHandler,
    });
    this.commands.set(volumeCommand.name, {
      command: volumeCommand,
      handler: volumeHandler,
    });
    this.commands.set(disconnectCommand.name, {
      command: disconnectCommand,
      handler: disconnectHandler,
    });
    this.commands.set(lyricsCommand.name, {
      command: lyricsCommand,
      handler: lyricsHandler,
    });
    this.commands.set(helpCommand.name, {
      command: helpCommand,
      handler: helpHandler,
    });
    this.commands.set(settingsCommand.name, {
      command: settingsCommand,
      handler: settingsHandler,
    });
  }

  async handleCommand(client: Client, interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.commandName;
        const commandData = this.commands.get(command);
        if (commandData) {
          await commandData.handler(interaction);
        } else {
          logger.warn(`Invalid command: ${command}`);
          await interaction.reply({ content: 'Invalid command. Please check the help menu for available commands.', ephemeral: true });
        }
      }
    } catch (error) {
      logger.error(`Error handling command interaction: ${error.message}`);
      await interaction.reply({ content: 'An error occurred. Please try again later.', ephemeral: true });
    }
  }

  async registerSlashCommands(client: Client) {
    try {
      const commands = Array.from(this.commands.values()).map((commandData) => commandData.command.toJSON());
      await client.application.commands.set(commands);
      logger.info('Slash commands registered successfully.');
    } catch (error) {
      logger.error(`Error registering slash commands: ${error.message}`);
    }
  }
}