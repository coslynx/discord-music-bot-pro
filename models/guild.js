import { Schema, model } from 'mongoose';

const guildSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: '!',
  },
  features: {
    lyrics: {
      type: Boolean,
      default: true,
    },
    playlist: {
      type: Boolean,
      default: true,
    },
    shuffle: {
      type: Boolean,
      default: true,
    },
    repeat: {
      type: Boolean,
      default: true,
    },
    volume: {
      type: Boolean,
      default: true,
    },
    visualizer: {
      type: Boolean,
      default: false,
    },
  },
  permissions: {
    manageQueue: {
      type: Object,
      default: {
        allowedRoles: ['admin'],
      },
    },
    skipSong: {
      type: Object,
      default: {
        allowedRoles: ['@everyone'],
      },
    },
    stopMusic: {
      type: Object,
      default: {
        allowedRoles: ['@everyone'],
      },
    },
  },
  // Add other guild-specific properties as needed
}, { timestamps: true });

export const Guild = model('Guild', guildSchema);