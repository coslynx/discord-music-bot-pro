import { Client, Interaction } from 'discord.js';
import { CommandHandler } from '../utils/commandHandler';

const commandHandler = new CommandHandler();

export const onInteractionCreate = async (client: Client, interaction: Interaction) => {
  try {
    // Check if the interaction is a command interaction
    if (interaction.isChatInputCommand()) {
      // Handle command interaction
      await commandHandler.handleCommand(client, interaction);
    } else if (interaction.isButton()) {
      // Handle button interaction
      await commandHandler.handleButton(client, interaction);
    } else if (interaction.isSelectMenu()) {
      // Handle select menu interaction
      await commandHandler.handleSelectMenu(client, interaction);
    } else if (interaction.isModalSubmit()) {
      // Handle modal submit interaction
      await commandHandler.handleModalSubmit(client, interaction);
    }
  } catch (error) {
    // Handle errors during interaction processing
    console.error('Error handling interaction:', error);
  }
};