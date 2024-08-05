import { Guild } from '../models/guild';
import { logger } from '../utils/logger';

export class GuildService {
  async createGuild(guildId, guildName) {
    try {
      const existingGuild = await this.getGuild(guildId);
      if (existingGuild) {
        logger.info(`Guild with ID ${guildId} already exists.`);
        return existingGuild;
      }

      const newGuild = new Guild({
        id: guildId,
        name: guildName,
        prefix: '!', // Default prefix
        features: {
          lyrics: true,
          playlist: true,
          shuffle: true,
          repeat: true,
          volume: true,
          visualizer: false, // Default visualizer disabled
        },
        permissions: {
          // Default permissions:
          // - Only admins can manage the queue.
          // - All roles can skip songs and stop music.
          manageQueue: {
            allowedRoles: ['admin'],
          },
          skipSong: {
            allowedRoles: ['@everyone'],
          },
          stopMusic: {
            allowedRoles: ['@everyone'],
          },
        },
      });

      await newGuild.save();
      logger.info(`New guild created: ${newGuild.name} (ID: ${newGuild.id})`);
      return newGuild;
    } catch (error) {
      logger.error(`Error creating guild: ${error.message}`);
      throw error;
    }
  }

  async getGuild(guildId) {
    try {
      const guild = await Guild.findOne({ id: guildId });
      return guild;
    } catch (error) {
      logger.error(`Error retrieving guild: ${error.message}`);
      throw error;
    }
  }

  async updatePrefix(guildId, newPrefix) {
    try {
      const guild = await Guild.findOneAndUpdate(
        { id: guildId },
        { prefix: newPrefix },
        { new: true },
      );
      if (!guild) {
        logger.warn(`Guild with ID ${guildId} not found.`);
        return null;
      }
      logger.info(`Guild prefix updated: ${guild.name} (ID: ${guild.id})`);
      return guild;
    } catch (error) {
      logger.error(`Error updating guild prefix: ${error.message}`);
      throw error;
    }
  }

  async updateFeature(guildId, feature, enabled) {
    try {
      const guild = await Guild.findOneAndUpdate(
        { id: guildId },
        { [`features.${feature}`]: enabled },
        { new: true },
      );
      if (!guild) {
        logger.warn(`Guild with ID ${guildId} not found.`);
        return null;
      }
      logger.info(
        `Guild feature updated: ${guild.name} (ID: ${guild.id}), ${feature} is now ${enabled ? 'enabled' : 'disabled'}`,
      );
      return guild;
    } catch (error) {
      logger.error(`Error updating guild feature: ${error.message}`);
      throw error;
    }
  }

  async updatePermissions(guildId, role, permissions) {
    try {
      const guild = await Guild.findOneAndUpdate(
        { id: guildId },
        { [`permissions.${role}`]: permissions },
        { new: true },
      );
      if (!guild) {
        logger.warn(`Guild with ID ${guildId} not found.`);
        return null;
      }
      logger.info(
        `Guild permissions updated: ${guild.name} (ID: ${guild.id}), permissions for role ${role} updated.`,
      );
      return guild;
    } catch (error) {
      logger.error(`Error updating guild permissions: ${error.message}`);
      throw error;
    }
  }

  async resetGuildSettings(guildId) {
    try {
      const guild = await Guild.findOneAndUpdate(
        { id: guildId },
        {
          prefix: '!',
          features: {
            lyrics: true,
            playlist: true,
            shuffle: true,
            repeat: true,
            volume: true,
            visualizer: false,
          },
          permissions: {
            manageQueue: {
              allowedRoles: ['admin'],
            },
            skipSong: {
              allowedRoles: ['@everyone'],
            },
            stopMusic: {
              allowedRoles: ['@everyone'],
            },
          },
        },
        { new: true },
      );
      if (!guild) {
        logger.warn(`Guild with ID ${guildId} not found.`);
        return null;
      }
      logger.info(
        `Guild settings reset to default values: ${guild.name} (ID: ${guild.id})`,
      );
      return guild;
    } catch (error) {
      logger.error(`Error resetting guild settings: ${error.message}`);
      throw error;
    }
  }

  async getAllGuilds() {
    try {
      const guilds = await Guild.find({});
      return guilds;
    } catch (error) {
      logger.error(`Error retrieving all guilds: ${error.message}`);
      throw error;
    }
  }
}