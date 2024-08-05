import { SlashCommandBuilder } from 'discord.js';
import { QueueService } from '../services/queueService';
import { MusicService } from '../services/musicService';
import { EmbedBuilder } from '../utils/embedBuilder';

const queueService = new QueueService();
const musicService = new MusicService();

export const playCommand = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song from YouTube, Spotify, or SoundCloud.')
  .addStringOption(option =>
    option.setName('query')
      .setDescription('The song or playlist to play.')
      .setRequired(true)
  );

export const playHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const guildMember = interaction.member;
    const query = interaction.options.getString('query');

    // Check if the user is in a voice channel
    if (!guildMember.voice.channel) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('You must be in a voice channel to play music.');
      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // Get the voice channel and join it
    const voiceChannel = guildMember.voice.channel;
    const connection = await musicService.joinVoiceChannel(voiceChannel);

    // Get the song or playlist from the search query
    const songOrPlaylist = await musicService.search(query);

    if (!songOrPlaylist) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('No results found for your search.');
      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    // Add the song or playlist to the queue
    const guildQueue = queueService.getQueue(guildId);
    if (guildQueue) {
      guildQueue.add(songOrPlaylist);
      const queueEmbed = new EmbedBuilder()
        .setColor('#00c6ff')
        .setTitle(`Added to Queue: ${songOrPlaylist.title}`);
      await interaction.reply({ embeds: [queueEmbed] });
    } else {
      // Start playing if the queue is empty
      queueService.createQueue(guildId, voiceChannel, songOrPlaylist);
      const playEmbed = new EmbedBuilder()
        .setColor('#00c6ff')
        .setTitle(`Now Playing: ${songOrPlaylist.title}`);
      await interaction.reply({ embeds: [playEmbed] });
    }
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};