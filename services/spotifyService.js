import SpotifyWebApi from 'spotify-web-api-node';
import { Song } from '../models/song';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export class SpotifyService {
  async search(query) {
    try {
      const searchResults = await spotifyApi.searchTracks({
        q: query,
        limit: 10,
      });

      if (searchResults.body.tracks.items.length === 0) {
        return null;
      }

      const song = searchResults.body.tracks.items[0];
      return new Song({
        title: song.name,
        artist: song.artists.map((artist) => artist.name).join(', '),
        url: song.external_urls.spotify,
        duration: song.duration_ms / 1000,
        thumbnail: song.album.images[0].url,
      });
    } catch (error) {
      console.error('Error searching Spotify:', error);
      return null;
    }
  }

  async getSongInfo(url) {
    try {
      const track = await spotifyApi.getTrack(url.split('/').pop());
      return new Song({
        title: track.body.name,
        artist: track.body.artists.map((artist) => artist.name).join(', '),
        url: track.body.external_urls.spotify,
        duration: track.body.duration_ms / 1000,
        thumbnail: track.body.album.images[0].url,
      });
    } catch (error) {
      console.error('Error getting Spotify song info:', error);
      return null;
    }
  }

  async getPlaylist(playlistId) {
    try {
      const playlist = await spotifyApi.getPlaylist(playlistId);
      const songs = playlist.body.tracks.items.map((item) => {
        return new Song({
          title: item.track.name,
          artist: item.track.artists.map((artist) => artist.name).join(', '),
          url: item.track.external_urls.spotify,
          duration: item.track.duration_ms / 1000,
          thumbnail: item.track.album.images[0].url,
        });
      });
      return songs;
    } catch (error) {
      console.error('Error getting Spotify playlist:', error);
      return null;
    }
  }

  async authorize() {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
      console.log('Spotify API successfully authorized.');
    } catch (error) {
      console.error('Error authorizing Spotify API:', error);
    }
  }
}
```

Explanation:

1. Imports: The code imports the `SpotifyWebApi` library for interacting with the Spotify API and the `Song` model from the project's `models` directory.

2. Spotify API Initialization: A `spotifyApi` instance is created using the `SpotifyWebApi` constructor. It takes the `clientId` and `clientSecret` from the environment variables, which are set in the `.env` file.

3. SpotifyService Class:
   - `search(query)`: This method searches Spotify for tracks matching the given `query`. It retrieves the first track from the search results and creates a `Song` object with relevant information.
   - `getSongInfo(url)`: This method fetches detailed information about a specific song from Spotify, given its URL. It creates a `Song` object with the retrieved information.
   - `getPlaylist(playlistId)`: This method retrieves all songs from a Spotify playlist, given its `playlistId`. It maps each playlist track to a `Song` object.
   - `authorize()`: This method performs the authorization process for the Spotify API using client credentials. It sets the access and refresh tokens for subsequent API requests.

4. Error Handling:
   - The `search`, `getSongInfo`, `getPlaylist`, and `authorize` methods use `try...catch` blocks to handle potential errors during API calls. Error messages are logged to the console for debugging purposes.

Integration with the Project:

- The `SpotifyService` class is designed to be used within the `MusicService` class. The `MusicService` will use the methods of `SpotifyService` to retrieve songs and playlists from Spotify, providing a consistent interface for handling music playback from various sources.

- The `authorize()` method should be called once at the start of the application to ensure the Spotify API is properly authorized before making any subsequent API calls.

Best Practices:

- Environment Variables: Sensitive information like the client ID and secret are stored in environment variables, ensuring they are not committed to the codebase.

- Error Handling: Comprehensive error handling ensures that the bot can gracefully recover from errors and provide informative messages to users.

- Code Structure: The code is well-organized into logical methods within a class, promoting code reusability and maintainability.

- Model Usage: The `Song` model is used to represent song data consistently, promoting data integrity and ease of use throughout the project.