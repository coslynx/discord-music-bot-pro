import { SlashCommandBuilder } from 'discord.js';
import { VoiceService } from '../services/voiceService';

const voiceService = new VoiceService();

export const stopCommand = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop music playback and disconnect the bot.');

export const stopHandler = async (interaction) => {
  try {
    const guildId = interaction.guildId;
    const guildMember = interaction.member;

    if (!guildMember.voice.channel) {
      await interaction.reply({ content: 'You must be in a voice channel to stop the music.', ephemeral: true });
      return;
    }

    await voiceService.stop(guildId);
    await interaction.reply({ content: 'Music playback stopped and disconnected from the voice channel.' });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};