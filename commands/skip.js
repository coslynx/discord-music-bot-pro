import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';

const queueService = new QueueService();

export const skipCommand = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the currently playing song.');

export const skipHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const guildQueue = queueService.getQueue(guildId);

    if (!guildQueue) {
      await interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
      return;
    }

    const skippedSong = guildQueue.skip();
    await interaction.reply({ content: `Skipped ${skippedSong.title}!` });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};