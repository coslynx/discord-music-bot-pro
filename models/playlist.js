import { Playlist } from './playlist';
import { Song } from './song';
import { logger } from '../utils/logger';

export class PlaylistService {
  async createPlaylist(guildId, name, userId, songs = []) {
    try {
      const existingPlaylist = await this.getPlaylistByName(guildId, name);
      if (existingPlaylist) {
        logger.info(`Playlist with name ${name} already exists in guild ${guildId}.`);
        return existingPlaylist;
      }

      const newPlaylist = new Playlist({
        guildId,
        name,
        userId,
        songs,
      });

      await newPlaylist.save();
      logger.info(`New playlist created: ${name} in guild ${guildId}.`);
      return newPlaylist;
    } catch (error) {
      logger.error(`Error creating playlist: ${error.message}`);
      throw error;
    }
  }

  async getPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      return playlist;
    } catch (error) {
      logger.error(`Error retrieving playlist: ${error.message}`);
      throw error;
    }
  }

  async getPlaylists(guildId) {
    try {
      const playlists = await Playlist.find({ guildId });
      return playlists;
    } catch (error) {
      logger.error(`Error retrieving playlists for guild ${guildId}: ${error.message}`);
      throw error;
    }
  }

  async getPlaylistByName(guildId, name) {
    try {
      const playlist = await Playlist.findOne({ guildId, name });
      return playlist;
    } catch (error) {
      logger.error(`Error retrieving playlist by name: ${error.message}`);
      throw error;
    }
  }

  async addSongToPlaylist(playlistId, song) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        logger.warn(`Playlist with ID ${playlistId} not found.`);
        return null;
      }

      if (!playlist.songs.some((s) => s.url === song.url)) {
        playlist.songs.push(song);
        await playlist.save();
        logger.info(`Song added to playlist ${playlist.name} (ID: ${playlist.id}).`);
      } else {
        logger.info(`Song already exists in playlist ${playlist.name} (ID: ${playlist.id}).`);
      }
      return playlist;
    } catch (error) {
      logger.error(`Error adding song to playlist: ${error.message}`);
      throw error;
    }
  }

  async removeSongFromPlaylist(playlistId, songUrl) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        logger.warn(`Playlist with ID ${playlistId} not found.`);
        return null;
      }

      const songIndex = playlist.songs.findIndex((song) => song.url === songUrl);
      if (songIndex !== -1) {
        playlist.songs.splice(songIndex, 1);
        await playlist.save();
        logger.info(`Song removed from playlist ${playlist.name} (ID: ${playlist.id}).`);
      } else {
        logger.info(`Song not found in playlist ${playlist.name} (ID: ${playlist.id}).`);
      }
      return playlist;
    } catch (error) {
      logger.error(`Error removing song from playlist: ${error.message}`);
      throw error;
    }
  }

  async updatePlaylist(playlistId, updateData) {
    try {
      const playlist = await Playlist.findByIdAndUpdate(playlistId, updateData, { new: true });
      if (!playlist) {
        logger.warn(`Playlist with ID ${playlistId} not found.`);
        return null;
      }
      logger.info(`Playlist updated: ${playlist.name} (ID: ${playlist.id}).`);
      return playlist;
    } catch (error) {
      logger.error(`Error updating playlist: ${error.message}`);
      throw error;
    }
  }

  async deletePlaylist(playlistId) {
    try {
      const playlist = await Playlist.findByIdAndDelete(playlistId);
      if (!playlist) {
        logger.warn(`Playlist with ID ${playlistId} not found.`);
        return null;
      }
      logger.info(`Playlist deleted: ${playlist.name} (ID: ${playlist.id}).`);
      return playlist;
    } catch (error) {
      logger.error(`Error deleting playlist: ${error.message}`);
      throw error;
    }
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        logger.warn(`Playlist with ID ${playlistId} not found.`);
        return [];
      }
      return playlist.songs.map((songData) => new Song(songData));
    } catch (error) {
      logger.error(`Error getting songs from playlist: ${error.message}`);
      throw error;
    }
  }
}