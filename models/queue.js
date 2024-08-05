import { Schema, model } from 'mongoose';

const queueSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  voiceChannel: {
    type: String,
    required: true,
  },
  connection: {
    type: Object,
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song',
  }],
  current: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
  },
  playing: {
    type: Boolean,
    default: false,
  },
  repeatMode: {
    type: String,
    enum: ['song', 'queue', 'off'],
    default: 'off',
  },
  volume: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

export const Queue = model('Queue', queueSchema);