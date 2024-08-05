import { Song } from '../models/song';
import { logger } from '../utils/logger';
import { YouTubeService } from './youtubeService';
import { SpotifyService } from './spotifyService';
import { SoundCloudService } from './soundcloudService';
import { VoiceService } from './voiceService';
import { PlaylistService } from './playlistService';
import { GuildService } from './guildService';

const youtubeService = new YouTubeService();
const spotifyService = new SpotifyService();
const soundCloudService = new SoundCloudService();
const voiceService = new VoiceService();
const playlistService = new PlaylistService();
const guildService = new GuildService();

export class MusicService {
  constructor() {
    this.queues = new Map();
  }

  async search(query) {
    try {
      // Check if it's a playlist URL
      if (query.includes('youtube.com/playlist') || query.includes('open.spotify.com/playlist') || query.includes('soundcloud.com/playlists')) {
        let playlistSongs;
        if (query.includes('youtube.com/playlist')) {
          playlistSongs = await youtubeService.getPlaylist(query);
        } else if (query.includes('open.spotify.com/playlist')) {
          playlistSongs = await spotifyService.getPlaylist(query);
        } else if (query.includes('soundcloud.com/playlists')) {
          playlistSongs = await soundCloudService.getPlaylist(query);
        }
        if (playlistSongs) {
          return playlistSongs;
        }
      }

      // Search for individual songs
      let song;
      if (query.includes('youtube.com/watch')) {
        song = await youtubeService.getSongInfo(query);
      } else if (query.includes('open.spotify.com/track')) {
        song = await spotifyService.getSongInfo(query);
      } else if (query.includes('soundcloud.com/tracks')) {
        song = await soundCloudService.getSongInfo(query);
      } else {
        // Search on all platforms
        song = await this.searchAllPlatforms(query);
      }

      if (song) {
        return song;
      }
      logger.warn(`No results found for search query: ${query}`);
      return null;
    } catch (error) {
      logger.error(`Error searching for music: ${error.message}`);
      return null;
    }
  }

  async searchAllPlatforms(query) {
    try {
      const youtubeResults = await youtubeService.search(query);
      const spotifyResults = await spotifyService.search(query);
      const soundCloudResults = await soundCloudService.search(query);

      const allResults = [...youtubeResults, ...spotifyResults, ...soundCloudResults];
      if (allResults.length > 0) {
        return allResults[0];
      }
      return null;
    } catch (error) {
      logger.error(`Error searching on all platforms: ${error.message}`);
      return null;
    }
  }

  async joinVoiceChannel(voiceChannel) {
    try {
      const connection = await voiceService.joinVoiceChannel(voiceChannel);
      logger.info(`Joined voice channel: ${voiceChannel.name}`);
      return connection;
    } catch (error) {
      logger.error(`Error joining voice channel: ${error.message}`);
      return null;
    }
  }

  async getSongInfo(url) {
    try {
      let song;
      if (url.includes('youtube.com/watch')) {
        song = await youtubeService.getSongInfo(url);
      } else if (url.includes('open.spotify.com/track')) {
        song = await spotifyService.getSongInfo(url);
      } else if (url.includes('soundcloud.com/tracks')) {
        song = await soundCloudService.getSongInfo(url);
      }
      if (song) {
        return song;
      }
      logger.warn(`Song info not found for URL: ${url}`);
      return null;
    } catch (error) {
      logger.error(`Error getting song info: ${error.message}`);
      return null;
    }
  }

  // Method to get a song from a playlist
  async getSongFromPlaylist(guildId, playlistId) {
    try {
      const guild = await guildService.getGuild(guildId);
      if (!guild) {
        logger.warn(`Guild not found: ${guildId}`);
        return null;
      }

      const playlist = await playlistService.getPlaylist(playlistId);
      if (!playlist) {
        logger.warn(`Playlist not found: ${playlistId}`);
        return null;
      }

      const songs = await playlistService.getSongsFromPlaylist(playlistId);
      return songs;
    } catch (error) {
      logger.error(`Error getting songs from playlist: ${error.message}`);
      return null;
    }
  }

  // Method to create a new playlist
  async createPlaylist(guildId, name, userId, songs = []) {
    try {
      const guild = await guildService.getGuild(guildId);
      if (!guild) {
        logger.warn(`Guild not found: ${guildId}`);
        return null;
      }

      const newPlaylist = await playlistService.createPlaylist(guildId, name, userId, songs);
      logger.info(`New playlist created: ${name} in guild ${guildId}.`);
      return newPlaylist;
    } catch (error) {
      logger.error(`Error creating playlist: ${error.message}`);
      return null;
    }
  }

  // Method to get all playlists for a guild
  async getPlaylists(guildId) {
    try {
      const guild = await guildService.getGuild(guildId);
      if (!guild) {
        logger.warn(`Guild not found: ${guildId}`);
        return null;
      }

      const playlists = await playlistService.getPlaylists(guildId);
      return playlists;
    } catch (error) {
      logger.error(`Error retrieving playlists: ${error.message}`);
      return null;
    }
  }

  // Method to get a playlist by name
  async getPlaylistByName(guildId, name) {
    try {
      const guild = await guildService.getGuild(guildId);
      if (!guild) {
        logger.warn(`Guild not found: ${guildId}`);
        return null;
      }

      const playlist = await playlistService.getPlaylistByName(guildId, name);
      return playlist;
    } catch (error) {
      logger.error(`Error retrieving playlist by name: ${error.message}`);
      return null;
    }
  }

  // Method to add a song to a playlist
  async addSongToPlaylist(playlistId, song) {
    try {
      const playlist = await playlistService.addSongToPlaylist(playlistId, song);
      logger.info(`Song added to playlist: ${playlist.name} (ID: ${playlist.id}).`);
      return playlist;
    } catch (error) {
      logger.error(`Error adding song to playlist: ${error.message}`);
      return null;
    }
  }

  // Method to remove a song from a playlist
  async removeSongFromPlaylist(playlistId, songUrl) {
    try {
      const playlist = await playlistService.removeSongFromPlaylist(playlistId, songUrl);
      logger.info(`Song removed from playlist: ${playlist.name} (ID: ${playlist.id}).`);
      return playlist;
    } catch (error) {
      logger.error(`Error removing song from playlist: ${error.message}`);
      return null;
    }
  }

  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}