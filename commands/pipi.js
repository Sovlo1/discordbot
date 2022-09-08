const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("pipi").setDescription("xd"),
  async execute(interaction) {
    interaction.reply("PIPI XD");
  },
};
