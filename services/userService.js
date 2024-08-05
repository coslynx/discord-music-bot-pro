import { User } from '../models/user';
import { logger } from '../utils/logger';
import { GuildService } from './guildService';

const guildService = new GuildService();

export class UserService {
  async createUser(userId, guildId, username) {
    try {
      const existingUser = await this.getUser(userId);
      if (existingUser) {
        logger.info(`User with ID ${userId} already exists.`);
        return existingUser;
      }

      const guild = await guildService.getGuild(guildId);
      const newUser = new User({
        id: userId,
        guildId,
        username,
        // Add other user properties as needed (e.g., joinedAt, lastActive, etc.)
      });

      await newUser.save();
      logger.info(`New user created: ${newUser.username} (ID: ${newUser.id})`);
      return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const user = await User.findOne({ id: userId });
      return user;
    } catch (error) {
      logger.error(`Error retrieving user: ${error.message}`);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findOneAndUpdate({ id: userId }, updateData, { new: true });
      if (!user) {
        logger.warn(`User with ID ${userId} not found.`);
        return null;
      }
      logger.info(`User updated: ${user.username} (ID: ${user.id})`);
      return user;
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findOneAndDelete({ id: userId });
      if (!user) {
        logger.warn(`User with ID ${userId} not found.`);
        return null;
      }
      logger.info(`User deleted: ${user.username} (ID: ${user.id})`);
      return user;
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }

  // Add more methods as needed for user-related operations:
  // - getGuildUsers(guildId): Fetch all users associated with a guild.
  // - getActiveUsers(): Fetch users who have been active recently.
  // - getUserPreferences(userId): Retrieve user preferences or settings.
  // - updateUserPreferences(userId, preferences): Update user preferences.
  // - banUser(userId): Implement a user ban function.
  // - muteUser(userId): Implement a user mute function.
  // - unbanUser(userId): Implement a user unban function.
  // - unmuteUser(userId): Implement a user unmute function.

}