import { Genius } from 'genius-lyrics-api';
import { logger } from '../utils/logger';

const genius = new Genius(process.env.GENIUS_ACCESS_TOKEN);

export class LyricsService {
  async getLyrics(songTitle) {
    try {
      const response = await genius.search(songTitle);
      if (response.hits.length > 0) {
        const song = response.hits[0].result;
        const lyrics = await song.lyrics();
        return lyrics;
      }
      logger.warn(`Lyrics not found for song: ${songTitle}`);
      return null;
    } catch (error) {
      logger.error(`Error retrieving lyrics for ${songTitle}: ${error.message}`);
      return null;
    }
  }
}