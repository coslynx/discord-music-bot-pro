import { SlashCommandBuilder } from 'discord.js';
import { GuildService } from '../services/guildService';
import { EmbedBuilder } from '../utils/embedBuilder';

const guildService = new GuildService();

export const settingsCommand = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('Manage bot settings for this server.')
  .addSubcommand(subcommand => 
    subcommand
      .setName('prefix')
      .setDescription('Change the bot command prefix.')
      .addStringOption(option =>
        option.setName('new_prefix')
          .setDescription('New command prefix for the bot.')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand => 
    subcommand
      .setName('feature')
      .setDescription('Enable or disable specific bot features.')
      .addStringOption(option =>
        option.setName('feature')
          .setDescription('The feature to enable or disable.')
          .setRequired(true)
          .addChoices(
            { name: 'lyrics', value: 'lyrics' },
            { name: 'playlist', value: 'playlist' },
            { name: 'shuffle', value: 'shuffle' },
            { name: 'repeat', value: 'repeat' },
            { name: 'volume', value: 'volume' },
            { name: 'visualizer', value: 'visualizer' }
          )
      )
      .addBooleanOption(option =>
        option.setName('enabled')
          .setDescription('Enable or disable the feature.')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('permissions')
      .setDescription('Manage bot permissions for specific roles.')
      .addStringOption(option =>
        option.setName('role')
          .setDescription('The role to modify permissions for.')
          .setRequired(true)
      )
      .addBooleanOption(option =>
        option.setName('manage_queue')
          .setDescription('Allow role to manage the queue.')
          .setRequired(true)
      )
      .addBooleanOption(option =>
        option.setName('skip_song')
          .setDescription('Allow role to skip songs.')
          .setRequired(true)
      )
      .addBooleanOption(option =>
        option.setName('stop_music')
          .setDescription('Allow role to stop music.')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('default')
      .setDescription('Reset settings to default values.')
  );

export const settingsHandler = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guildId;

  try {
    switch (subcommand) {
      case 'prefix':
        const newPrefix = interaction.options.getString('new_prefix');
        await guildService.updatePrefix(guildId, newPrefix);
        await interaction.reply({
          content: `Command prefix changed to \`${newPrefix}\`.`,
          ephemeral: true
        });
        break;

      case 'feature':
        const feature = interaction.options.getString('feature');
        const enabled = interaction.options.getBoolean('enabled');
        await guildService.updateFeature(guildId, feature, enabled);
        await interaction.reply({
          content: `Feature \`${feature}\` is now ${enabled ? 'enabled' : 'disabled'}.`,
          ephemeral: true
        });
        break;

      case 'permissions':
        const role = interaction.options.getString('role');
        const manageQueue = interaction.options.getBoolean('manage_queue');
        const skipSong = interaction.options.getBoolean('skip_song');
        const stopMusic = interaction.options.getBoolean('stop_music');
        await guildService.updatePermissions(guildId, role, {
          manageQueue,
          skipSong,
          stopMusic
        });
        await interaction.reply({
          content: `Permissions for role \`${role}\` updated.`,
          ephemeral: true
        });
        break;

      case 'default':
        await guildService.resetGuildSettings(guildId);
        await interaction.reply({
          content: 'Settings reset to default values.',
          ephemeral: true
        });
        break;

      default:
        // This shouldn't happen, but it's good to have a default case
        await interaction.reply({
          content: 'Invalid settings command.',
          ephemeral: true
        });
    }
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Error')
      .setDescription(`An error occurred: ${error.message}`);
    await interaction.reply({ embeds: [errorEmbed] });
  }
};