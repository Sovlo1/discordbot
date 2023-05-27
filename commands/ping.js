const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const pingedRecently = require("../pingCheck");
const { dotaChan, dotaRole } = require("../config.json");
const userIdRegex = /(<@[0-9]+>)/;

const DateTimeRecognizers = require("@microsoft/recognizers-text-date-time");
var Recognizers = require("@microsoft/recognizers-text-suite");
const moment = require("moment");

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
      interaction.reply(
        interaction.user.username + ` just sent a ping in <#${dotaChan}>`
      );
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
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
        let whens = Recognizers.recognizeDateTime(
          option,
          Recognizers.Culture.French
        );
        let timeToPlay;
        let times = [];
        let time = Date.now();
        recognizeTime = (x) => {
          if (x.length === 0) {
            return (timeToPlay = time);
          } else {
            if (x[0].resolution === null) {
              if (moment(x[0].text, "HH:mm").valueOf() !== NaN) {
                return (timeToPlay = moment(x[0].text, "HH:mm").valueOf());
              } else {
                return (timeToPlay = time);
              }
            }
            for (i = 0; i < x[0].resolution.values.length; i++) {
              if (x[0].resolution.values[i].type === "time") {
                times.push(
                  moment(x[0].resolution.values[i].value, "HH:mm:ss").valueOf()
                );
              } else if (x[0].resolution.values[i].type === "datetime") {
                times.push(
                  moment(
                    x[0].resolution.values[i].value,
                    "YYYY-MM-DD HH:mm:ss"
                  ).valueOf()
                );
              }
            }
            times.sort();
            for (i = 0; i < times.length; i++) {
              if (times[i] > time) {
                timeToPlay = times[i];
                break;
              } else if (times[i] < time) {
                timeToPlay = times[i];
              }
            }
            if (timeToPlay - time > 12 * 60 * 60 * 1000) {
              return (timeToPlay = time);
            }
          }
        };
        recognizeTime(whens);
        pingMsg = {
          content:
            `${dotaRole} à ` +
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
    }
  },
};
