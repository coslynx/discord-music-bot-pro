import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';
import { MusicService } from '../services/musicService';
import { EmbedBuilder } from '../utils/embedBuilder';

const queueService = new QueueService();
const musicService = new MusicService();

export const nowPlayingCommand = new SlashCommandBuilder()
  .setName('nowplaying')
  .setDescription('Display information about the currently playing song.');

export const nowPlayingHandler = async (interaction) => {
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

    const currentSong = guildQueue.current;

    // Fetch additional song information if not available (for example, from YouTube)
    if (!currentSong.duration || !currentSong.thumbnail) {
      const songInfo = await musicService.getSongInfo(currentSong.url);
      currentSong.duration = songInfo.duration;
      currentSong.thumbnail = songInfo.thumbnail;
    }

    const nowPlayingEmbed = new EmbedBuilder()
      .setColor('#00c6ff')
      .setTitle(`Now Playing: ${currentSong.title}`)
      .setThumbnail(currentSong.thumbnail)
      .addFields(
        { name: 'Artist', value: currentSong.artist },
        { name: 'Duration', value: musicService.formatTime(currentSong.duration) },
        { name: 'Requested by', value: currentSong.requestedBy },
      );

    await interaction.reply({ embeds: [nowPlayingEmbed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};