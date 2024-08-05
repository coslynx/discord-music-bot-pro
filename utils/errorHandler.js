import { logger } from './logger';

/
  Handles errors gracefully, logs them, and sends a user-friendly message to the Discord channel.
 
  @param {Error} error The error object to handle.
  @param {Interaction} interaction The Discord interaction object (for sending messages).
 /
export const handleError = async (error, interaction) => {
  try {
    // Log the error for debugging purposes
    logger.error(`An error occurred: ${error.message}`);

    // Send a user-friendly error message to the Discord channel
    await interaction.reply({
      content: 'An error occurred. Please try again later.',
      ephemeral: true,
    });
  } catch (replyError) {
    // Log any error that occurred while sending the reply message
    logger.error(`Error sending reply message: ${replyError.message}`);
  }
};