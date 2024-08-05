import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  // Add other user properties as needed (e.g., joinedAt, lastActive, etc.)
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const User = model('User', userSchema);