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
    let pingMsg;
    if (pingedRecently.has(interaction.user.id)) {
      return await interaction.reply(
        "Vous ne pouvez pas repinger avant au moins 20 minutes"
      );
    } else {
      const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("SelectDota")
          .setPlaceholder("Nothing selected")
          .addOptions(
            {
              label: `Ok ça me va`,
              description: " ",
              value: "un instant",
            },
            {
              label: `Ok mais 5-10 minutes après`,
              description: " ",
              value: "5-10",
            },
            {
              label: `Ok mais 10-20 minutes après`,
              description: " ",
              value: "10-20",
            },
            {
              label: `Ok mais 20-30 minutes après`,
              description: " ",
              value: "20-30",
            },
            {
              label: `Le monde a changé...`,
              description: " ",
              value: "quit",
            }
          )
      );
      if (interaction.options.getString("détails") != null) {
        option = interaction.options.getString("détails");
        pingMsg = {
          content:
            "<@&1015923384372166696> " +
            option +
            " \n" +
            `<@${interaction.user.id}> est dispo à ` +
            option,
          components: [row],
        };
      } else {
        option = "";
        pingMsg = {
          content:
            "<@&1015923384372166696>" +
            " \n" +
            `<@${interaction.user.id}> est dispo`,
          components: [row],
        };
      }
      pingedRecently.add(interaction.user.id);
      setTimeout(() => {
        pingedRecently.delete(interaction.user.id);
      }, 20 * 60 * 1000);
      const sentPing = await interaction.client.channels.cache
        .get("1015923444833079366")
        .send(pingMsg);
      await sentPing.startThread({
        name: "Nouveau ping pour doto " + sentPing.id,
        autoArchiveDuration: 60,
      });
      await interaction.reply(
        interaction.user.username +
          " just sent a ping in <#1015923444833079366>"
      );
    }
  },
};
