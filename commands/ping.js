const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const pingedRecently = require("../pingCheck");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pour pour dota (20 minutes de cooldown)"),
  async execute(interaction) {
    if (pingedRecently.has(interaction.user.id)) {
      return await interaction.reply(
        "Vous ne pouvez pas repinger avant au moins 20 minutes"
      );
    } else {
      pingedRecently.add(interaction.user.id);
      setTimeout(() => {
        pingedRecently.delete(interaction.user.id);
      }, 20 * 60 * 1000);
      await interaction.client.channels.cache
        .get("1015923444833079366")
        .send({ content: "<@&1015923384372166696>" })
        .then(
          interaction.reply(
            interaction.user.username +
              " just sent a ping in <#1015923444833079366>"
          )
        )
        .catch(console.error);
    }
  },
};
