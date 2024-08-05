import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';

const queueService = new QueueService();

export const shuffleCommand = new SlashCommandBuilder()
  .setName('shuffle')
  .setDescription('Shuffle the order of songs in the queue.');

export const shuffleHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const guildQueue = queueService.getQueue(guildId);

    if (!guildQueue) {
      await interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
      return;
    }

    guildQueue.shuffle();
    await interaction.reply({ content: 'Queue shuffled!' });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};