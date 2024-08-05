import  as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

export const envConfig = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,
  GENIUS_ACCESS_TOKEN: process.env.GENIUS_ACCESS_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  PREFIX: process.env.PREFIX,
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL,
};

// Check if all required environment variables are present
if (Object.values(envConfig).some((value) => !value)) {
  throw new Error('Missing required environment variables. Please check your .env file.');
}