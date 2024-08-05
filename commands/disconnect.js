import { SlashCommandBuilder } from 'discord.js';
import { VoiceService } from '../services/voiceService';

const voiceService = new VoiceService();

export const disconnectCommand = new SlashCommandBuilder()
  .setName('disconnect')
  .setDescription('Disconnect the bot from the voice channel.');

export const disconnectHandler = async (interaction) => {
  try {
    const guildMember = interaction.member;
    if (!guildMember.voice.channel) {
      await interaction.reply({ content: 'You must be in a voice channel to disconnect the bot.', ephemeral: true });
      return;
    }

    await voiceService.disconnect(interaction.guildId);
    await interaction.reply({ content: 'Disconnected from the voice channel.' });
  } catch (error) {
    await interaction.reply({ content: `An error occurred: ${error.message}`, ephemeral: true });
  }
};