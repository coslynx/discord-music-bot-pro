import { Schema, model } from 'mongoose';

const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  source: {
    type: String,
    enum: ['youtube', 'spotify', 'soundcloud'],
    required: true,
  },
  requestedBy: {
    type: String, // Discord user ID
  },
  // Add other properties as needed (e.g., lyrics, releaseDate, etc.)
}, { timestamps: true });

export const Song = model('Song', songSchema);