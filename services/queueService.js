import { Song } from '../models/song';
import { logger } from '../utils/logger';

export class QueueService {
  constructor() {
    this.queues = new Map();
  }

  createQueue(guildId, voiceChannel, initialSong = null) {
    try {
      const guildQueue = {
        guildId,
        voiceChannel,
        connection: null,
        songs: [],
        current: null,
        playing: false,
        repeatMode: 'off',
        volume: 1, // Default volume is 100%
      };

      // Add initial song to the queue if provided
      if (initialSong) {
        guildQueue.songs.push(initialSong);
        guildQueue.current = initialSong;
      }

      this.queues.set(guildId, guildQueue);
      logger.info(`[${guildId}] New queue created.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error creating queue: ${error.message}`);
      throw error;
    }
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  addToQueue(guildId, song) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      guildQueue.songs.push(song);
      logger.info(`[${guildId}] Added song to queue: ${song.title}`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error adding song to queue: ${error.message}`);
      throw error;
    }
  }

  removeSong(guildId, songUrl) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      const songIndex = guildQueue.songs.findIndex((song) => song.url === songUrl);
      if (songIndex !== -1) {
        const removedSong = guildQueue.songs.splice(songIndex, 1)[0];
        logger.info(`[${guildId}] Removed song from queue: ${removedSong.title}`);
        return removedSong;
      }
      logger.info(`[${guildId}] Song not found in queue: ${songUrl}`);
      return null;
    } catch (error) {
      logger.error(`Error removing song from queue: ${error.message}`);
      throw error;
    }
  }

  // Method to skip the current song
  skip(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      if (guildQueue.songs.length === 0) {
        logger.info(`[${guildId}] Queue is empty.`);
        return null;
      }

      const skippedSong = guildQueue.current; // Store the current song

      // Move to the next song
      guildQueue.current = guildQueue.songs.shift();

      // If repeat mode is 'song', add the skipped song back to the queue
      if (guildQueue.repeatMode === 'song') {
        guildQueue.songs.push(skippedSong);
      }

      logger.info(`[${guildId}] Skipped song: ${skippedSong.title}`);
      return skippedSong;
    } catch (error) {
      logger.error(`Error skipping song: ${error.message}`);
      throw error;
    }
  }

  // Method to stop playback and clear the queue
  stop(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      // Stop the current playback
      if (guildQueue.connection) {
        guildQueue.connection.destroy();
      }

      // Clear the queue
      guildQueue.songs = [];
      guildQueue.current = null;
      guildQueue.playing = false;

      logger.info(`[${guildId}] Stopped playback and cleared queue.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error stopping playback: ${error.message}`);
      throw error;
    }
  }

  // Method to set the repeat mode
  setRepeatMode(guildId, mode) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      if (mode === 'song' || mode === 'queue' || mode === 'off') {
        guildQueue.repeatMode = mode;
        logger.info(`[${guildId}] Repeat mode set to ${mode}.`);
        return guildQueue;
      }
      logger.info(`[${guildId}] Invalid repeat mode: ${mode}`);
      return null;
    } catch (error) {
      logger.error(`Error setting repeat mode: ${error.message}`);
      throw error;
    }
  }

  // Method to shuffle the queue
  shuffle(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      // Fisher-Yates Shuffle Algorithm
      for (let i = guildQueue.songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random()  (i + 1));
        [guildQueue.songs[i], guildQueue.songs[j]] = [guildQueue.songs[j], guildQueue.songs[i]];
      }

      logger.info(`[${guildId}] Shuffled queue.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error shuffling queue: ${error.message}`);
      throw error;
    }
  }

  // Method to set the volume
  setVolume(guildId, volume) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      // Validate volume input
      if (volume < 0 || volume > 1) {
        logger.info(`[${guildId}] Invalid volume: ${volume}`);
        return null;
      }

      guildQueue.volume = volume;
      logger.info(`[${guildId}] Volume set to ${volume  100}%.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error setting volume: ${error.message}`);
      throw error;
    }
  }

  // Method to get the current song in the queue
  getCurrentSong(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      return guildQueue.current;
    } catch (error) {
      logger.error(`Error getting current song: ${error.message}`);
      throw error;
    }
  }

  // Method to get the queue's current state
  getState(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      return {
        playing: guildQueue.playing,
        current: guildQueue.current,
        repeatMode: guildQueue.repeatMode,
        volume: guildQueue.volume,
      };
    } catch (error) {
      logger.error(`Error getting queue state: ${error.message}`);
      throw error;
    }
  }

  // Method to clear the current queue
  clearQueue(guildId) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      guildQueue.songs = [];
      guildQueue.current = null;
      logger.info(`[${guildId}] Queue cleared.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error clearing queue: ${error.message}`);
      throw error;
    }
  }

  // Method to update the queue's voice channel
  updateVoiceChannel(guildId, newVoiceChannel) {
    try {
      const guildQueue = this.getQueue(guildId);
      if (!guildQueue) {
        logger.warn(`[${guildId}] Queue not found.`);
        return null;
      }

      guildQueue.voiceChannel = newVoiceChannel;
      logger.info(`[${guildId}] Queue voice channel updated.`);
      return guildQueue;
    } catch (error) {
      logger.error(`Error updating queue voice channel: ${error.message}`);
      throw error;
    }
  }
}