import  as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

export class ConfigReader {
  /
    Reads the configuration from the environment variables.
    @returns {object} The configuration object.
   /
  readConfig() {
    const config = {
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
      SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,
      GENIUS_ACCESS_TOKEN: process.env.GENIUS_ACCESS_TOKEN,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      PREFIX: process.env.PREFIX,
    };

    // Check if all required configuration values are present
    if (Object.values(config).some((value) => !value)) {
      throw new Error('Missing required configuration values. Please check your .env file.');
    }

    return config;
  }
}