const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const pingedRecently = require("../pingCheck");
const { dotaChan, dotaRole } = require("../config.json");
const userIdRegex = /(<@[0-9]+>)/;

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
    let pingMsg;
    let option;
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
        option = interaction.options
          .getString("détails")
          .split(" ")
          .map((x) => {
            if (!userIdRegex.test(x)) {
              return x;
            } else {
              let user;
              let userId = x
                .split("")
                .map((y) => {
                  if (/\d+/.test(y)) {
                    return y;
                  }
                })
                .filter((y) => typeof y === "string")
                .join("");
              user = interaction.client.users.cache.get(userId);
              return user.username;
            }
          })
          .filter((x) => typeof x === "string")
          .join(" ");
        pingMsg = {
          content:
            `${dotaRole} ` +
            option +
            " \n" +
            `<@${interaction.user.id}> est disponible à ` +
            option,
          components: [row],
        };
      } else {
        option = "";
        pingMsg = {
          content:
            `${dotaRole}` + " \n" + `<@${interaction.user.id}> est disponible`,
          components: [row],
        };
      }
      pingedRecently.add(interaction.user.id);
      setTimeout(() => {
        pingedRecently.delete(interaction.user.id);
      }, 20 * 60 * 1000);
      const sentPing = await interaction.client.channels.cache
        .get(dotaChan)
        .send(pingMsg);
      await sentPing.startThread({
        name: "Nouveau ping pour doto " + sentPing.id,
        autoArchiveDuration: 60,
      });
      await interaction.reply(
        interaction.user.username + ` just sent a ping in <#${dotaChan}>`
      );
    }
  },
};
