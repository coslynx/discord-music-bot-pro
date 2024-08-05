import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from '../utils/embedBuilder';

export const helpCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get a list of available commands.');

export const helpHandler = async (interaction) => {
  try {
    const commandList = [
      { name: 'play', description: 'Play a song from YouTube, Spotify, or SoundCloud.' },
      { name: 'skip', description: 'Skip the currently playing song.' },
      { name: 'stop', description: 'Stop music playback and disconnect the bot.' },
      { name: 'queue', description: 'View the current song queue.' },
      { name: 'search', description: 'Search for songs on YouTube, Spotify, or SoundCloud.' },
      { name: 'nowplaying', description: 'Display information about the currently playing song.' },
      { name: 'repeat', description: 'Toggle repeat mode (song, queue, or off).' },
      { name: 'shuffle', description: 'Shuffle the order of songs in the queue.' },
      { name: 'volume', description: 'Adjust the playback volume.' },
      { name: 'disconnect', description: 'Disconnect the bot from the voice channel without stopping playback.' },
      { name: 'lyrics', description: 'Display lyrics for the currently playing song.' },
      { name: 'settings', description: 'Manage bot settings for this server.' },
    ];

    const helpEmbed = new EmbedBuilder()
      .setColor('#00c6ff')
      .setTitle('Help Menu')
      .setDescription('Here are the available commands:')
      .addFields(
        commandList.map((command) => ({
          name: `/${command.name}`,
          value: command.description,
        })),
      );

    await interaction.reply({ embeds: [helpEmbed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};