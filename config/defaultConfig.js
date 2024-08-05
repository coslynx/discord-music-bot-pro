// config/defaultConfig.js

module.exports = {
  // Discord Bot Token
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,

  // Spotify API Credentials
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,

  // SoundCloud API Credentials
  SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,

  // Genius Lyrics API Access Token
  GENIUS_ACCESS_TOKEN: process.env.GENIUS_ACCESS_TOKEN,

  // YouTube Data API Key
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,

  // Default Command Prefix
  PREFIX: process.env.PREFIX,

  // MongoDB Connection URI (if using MongoDB)
  MONGODB_URI: process.env.MONGODB_URI,

  // Redis Connection URI (if using Redis)
  REDIS_URL: process.env.REDIS_URL,

  // Other Configuration Options (as needed)
  // ...
};