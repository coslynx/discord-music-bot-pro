import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';

const queueService = new QueueService();

export const repeatCommand = new SlashCommandBuilder()
  .setName('repeat')
  .setDescription('Toggle repeat mode (song, queue, or off).')
  .addStringOption(option =>
    option.setName('mode')
      .setDescription('The repeat mode to set.')
      .setRequired(true)
      .addChoices(
        { name: 'Song', value: 'song' },
        { name: 'Queue', value: 'queue' },
        { name: 'Off', value: 'off' },
      )
  );

export const repeatHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const mode = interaction.options.getString('mode');
    const guildQueue = queueService.getQueue(guildId);

    if (!guildQueue) {
      await interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
      return;
    }

    // Update repeat mode
    guildQueue.setRepeatMode(mode);

    // Send confirmation message
    let message = '';
    switch (mode) {
      case 'song':
        message = 'Repeat mode set to song.';
        break;
      case 'queue':
        message = 'Repeat mode set to queue.';
        break;
      case 'off':
        message = 'Repeat mode disabled.';
        break;
      default:
        message = 'Invalid repeat mode.';
    }
    await interaction.reply({ content: message });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};