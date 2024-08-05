import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';
import { LyricsService } from '../services/lyricsService';
import { EmbedBuilder } from '../utils/embedBuilder';

const queueService = new QueueService();
const lyricsService = new LyricsService();

export const lyricsCommand = new SlashCommandBuilder()
  .setName('lyrics')
  .setDescription('Display lyrics for the currently playing song.');

export const lyricsHandler = async (interaction) => {
  try {
    const guildQueue = queueService.getQueue(interaction.guildId);
    if (!guildQueue) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('There is no song currently playing.');
      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const lyrics = await lyricsService.getLyrics(guildQueue.current.title);
    if (lyrics) {
      const lyricsEmbed = new EmbedBuilder()
        .setColor('#00c6ff')
        .setTitle(`Lyrics for ${guildQueue.current.title}`)
        .setDescription(lyrics);
      await interaction.reply({ embeds: [lyricsEmbed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('Lyrics not found for this song.');
      await interaction.reply({ embeds: [errorEmbed] });
    }
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};