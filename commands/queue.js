import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';
import { EmbedBuilder } from '../utils/embedBuilder';

const queueService = new QueueService();

export const queueCommand = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('View the current song queue.');

export const queueHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const guildQueue = queueService.getQueue(guildId);

    if (!guildQueue) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('There is no song currently playing.');
      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const queueEmbed = new EmbedBuilder()
      .setColor('#00c6ff')
      .setTitle('Song Queue');

    if (guildQueue.songs.length === 0) {
      queueEmbed.setDescription('The queue is empty.');
    } else {
      queueEmbed.setDescription(guildQueue.songs.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n'));
    }

    await interaction.reply({ embeds: [queueEmbed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};