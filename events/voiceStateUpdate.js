import { Client, VoiceState } from 'discord.js';
import { VoiceService } from '../services/voiceService';
import { QueueService } from '../services/queueService';

const voiceService = new VoiceService();
const queueService = new QueueService();

export const onVoiceStateUpdate = async (client: Client, oldState: VoiceState, newState: VoiceState) => {
  try {
    // If the bot is alone in a voice channel, disconnect after a timeout
    if (newState.guild.members.cache.filter(member => !member.user.bot).size === 1
        && newState.member.id === client.user.id) {
      setTimeout(async () => {
        const guildId = newState.guild.id;
        const guildQueue = queueService.getQueue(guildId);
        if (guildQueue) {
          await guildQueue.stop();
        }
        await voiceService.disconnect(guildId);
        console.log(`[${newState.guild.name}] Bot disconnected from voice channel after inactivity.`);
      }, 600000); // 10 minutes timeout
    }
  } catch (error) {
    console.error('Error handling voice state update:', error);
  }
};