const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const pingedRecently = require("../pingCheck");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dota")
    .setDescription("Pour pour dota (20 minutes de cooldown)")
    .addStringOption((option) =>
      option
        .setName("détails")
        .setDescription("Pour préciser à quelle heure par exemple lo tsé")
        .setRequired(false)
    ),
  async execute(interaction) {
    let option;
    if (interaction.options.getString("détails") != null) {
      option = interaction.options.getString("détails");
    } else {
      option = "";
    }
    if (pingedRecently.has(interaction.user.id)) {
      return await interaction.reply(
        "Vous ne pouvez pas repinger avant au moins 20 minutes"
      );
    } else {
      const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("Select")
          .setPlaceholder("Nothing selected")
          .addOptions(
            {
              label: `dans 5-10 minutes`,
              description: " ",
              value: "5-10",
            },
            {
              label: `dans 10-20 minutes`,
              description: " ",
              value: "10-20",
            },
            {
              label: `dans 20-30 minutes`,
              description: " ",
              value: "20-30",
            },
            {
              label: `dans 30-45 minutes`,
              description: " ",
              value: "30-45",
            },
            {
              label: `dans 45-60 minutes`,
              description: " ",
              value: "45-60",
            }
          )
      );
      pingedRecently.add(interaction.user.id);
      setTimeout(() => {
        pingedRecently.delete(interaction.user.id);
      }, 20 * 60 * 1000);
      const sentPing = await interaction.client.channels.cache
        .get("1015923444833079366")
        .send({
          content: "<@&1015923384372166696> " + option,
          components: [row],
        });
      await interaction.reply(
        interaction.user.username +
          " just sent a ping in <#1015923444833079366>"
      );
      setTimeout(() => {
        row.components[0].setDisabled(true),
          sentPing.edit({
            content: "<@&1015923384372166696> " + option,
            components: [row],
          });
      }, 60 * 60 * 1000);
      sentPing.edit({
        content: "<@&1015923384372166696> " + option,
        components: [row],
      });
    }
  },
};
