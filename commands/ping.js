const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pour pour dota (20 minutes de cooldown)"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
