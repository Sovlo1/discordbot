const { SlashCommandBuilder } = require("discord.js");
const pingedRecently = require("../pingCheck");

module.exports = {
  data: new SlashCommandBuilder().setName("debug").setDescription("dev"),
  async execute(interaction) {
    pingedRecently.delete(interaction.user.id);
    return interaction.reply("lol");
  },
};
