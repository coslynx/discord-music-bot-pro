import { MessageEmbed } from 'discord.js';

export class EmbedBuilder {
  /
    Creates a new EmbedBuilder instance.
   /
  constructor() {
    this.embed = new MessageEmbed();
  }

  /
    Sets the title of the embed.
    @param {string} title The title of the embed.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setTitle(title) {
    this.embed.setTitle(title);
    return this;
  }

  /
    Sets the description of the embed.
    @param {string} description The description of the embed.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setDescription(description) {
    this.embed.setDescription(description);
    return this;
  }

  /
    Sets the color of the embed.
    @param {string} color The color of the embed.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setColor(color) {
    this.embed.setColor(color);
    return this;
  }

  /
    Adds a field to the embed.
    @param {object} field The field to add.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  addField(field) {
    this.embed.addField(field.name, field.value, field.inline);
    return this;
  }

  /
    Sets the thumbnail of the embed.
    @param {string} url The URL of the thumbnail.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setThumbnail(url) {
    this.embed.setThumbnail(url);
    return this;
  }

  /
    Sets the footer of the embed.
    @param {string} text The text of the footer.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setFooter(text) {
    this.embed.setFooter({ text });
    return this;
  }

  /
    Sets the timestamp of the embed.
    @returns {EmbedBuilder} The EmbedBuilder instance.
   /
  setTimestamp() {
    this.embed.setTimestamp();
    return this;
  }

  /
    Returns the built embed object.
    @returns {MessageEmbed} The built embed object.
   /
  build() {
    return this.embed;
  }
}