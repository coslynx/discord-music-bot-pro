import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../services/musicService';
import { EmbedBuilder } from '../utils/embedBuilder';

const musicService = new MusicService();

export const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for songs on YouTube, Spotify, or SoundCloud.')
  .addStringOption(option =>
    option.setName('query')
      .setDescription('The search query.')
      .setRequired(true)
  );

export const searchHandler = async (interaction) => {
  try {
    const query = interaction.options.getString('query');
    const searchResults = await musicService.search(query);

    if (searchResults.length === 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription('No results found for your search.');
      await interaction.reply({ embeds: [errorEmbed] });
      return;
    }

    const searchResultsEmbed = new EmbedBuilder()
      .setColor('#00c6ff')
      .setTitle(`Search Results for "${query}"`)
      .setDescription(searchResults.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n'));

    await interaction.reply({ embeds: [searchResultsEmbed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};