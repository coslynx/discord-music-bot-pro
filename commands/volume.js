import { SlashCommandBuilder } from 'discord.js';
import { VoiceService } from '../services/voiceService';

const voiceService = new VoiceService();

export const volumeCommand = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Adjust the playback volume.')
  .addIntegerOption(option =>
    option.setName('volume')
      .setDescription('The new volume (1-100).')
      .setRequired(true)
  );

export const volumeHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const volume = interaction.options.getInteger('volume');

    // Validate volume input
    if (volume < 1 || volume > 100) {
      await interaction.reply({ content: 'Volume must be between 1 and 100.', ephemeral: true });
      return;
    }

    // Set the volume using the VoiceService
    await voiceService.setVolume(guildId, volume / 100);
    await interaction.reply({ content: `Volume set to ${volume}%` });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};