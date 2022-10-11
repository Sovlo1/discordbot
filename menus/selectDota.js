const DateTimeRecognizers = require("@microsoft/recognizers-text-date-time");
var Recognizers = require("@microsoft/recognizers-text-suite");
const moment = require("moment");

const recognizer = new DateTimeRecognizers.DateTimeRecognizer(
  Recognizers.Culture.French
).getDateTimeModel();

module.exports = {
  data: {
    name: "SelectDota",
  },
  async execute(interaction) {
    let time = Date.now();
    if (time - interaction.message.createdTimestamp > 60 * 60 * 1000)
      return await interaction.reply({
        content:
          "Ce ping est trop ancien, veuillez en relancer un en utilisant /dota ou vous manifester sur un ping plus récent.",
        ephemeral: true,
      });
    let players;
    const channel = interaction.client.channels.cache.get(
      interaction.channelId
    );
    let message = await interaction.message.fetch(interaction.message.id);
    let messageArray = message.content.split(" ");
    let whoPlaysArray = message.content.split("\n");
    let whoPlaysUpdated = whoPlaysArray
      .filter((x) => !x.includes(interaction.user.id))
      .join("\n");
    const userIdRegex = /(<@[0-9]+>)/;
    let userArray = messageArray
      .map((x) => {
        if (userIdRegex.test(x)) {
          return x;
        } else return;
      })
      .filter((x) => typeof x === "string");
    let whens = Recognizers.recognizeDateTime(
      whoPlaysArray[0],
      Recognizers.Culture.French
    );
    let times = [];
    let timeToPlay;
    recognizeTime = (x) => {
      if (x.length === 0) {
        return (timeToPlay = interaction.message.createdTimestamp);
      } else {
        if (x[0].resolution === null) {
          return (timeToPlay = interaction.message.createdTimestamp);
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
          if (times[i] > interaction.message.createdTimestamp) {
            timeToPlay = times[i];
            break;
          } else if (times[i] < interaction.message.createdTimestamp) {
            timeToPlay = times[i];
          }
        }
        if (
          timeToPlay - interaction.message.createdTimestamp >
          12 * 60 * 60 * 1000
        ) {
          return (timeToPlay = interaction.message.createdTimestamp);
        }
      }
    };
    recognizeTime(whens);
    let offset = 0;
    if (
      interaction.values[0] == "un instant"
      // &&
      // !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n" +
          `<@${interaction.user.id}>` +
          " sera disponible dans " +
          interaction.values[0]
      );
    } else if (
      interaction.values[0] == "5-10"
      // &&
      // !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n" +
          `<@${interaction.user.id}>` +
          " sera disponible dans " +
          interaction.values[0]
      );
      offset = 5;
    } else if (
      interaction.values[0] == "10-20"
      // &&
      // !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n" +
          `<@${interaction.user.id}>` +
          " sera disponible dans " +
          interaction.values[0]
      );
      offset = 10;
    } else if (
      interaction.values[0] == "20-30"
      // &&
      // !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n" +
          `<@${interaction.user.id}>` +
          " sera disponible dans " +
          interaction.values[0]
      );
      offset = 20;
    } else if (
      interaction.values[0] == "quit"
      // &&
      // interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(whoPlaysUpdated);
    } else {
      return await interaction.reply({
        content:
          "Si vous voulez changer d'option il faut d'abord selectionner 'le monde a changé...' puis choisir une nouvelle option",
        ephemeral: true,
      });
    }
    if (userArray.length >= 4 && interaction.values[0] != "quit") {
      for (i = 1; i < whoPlaysArray.length; i++) {
        if (whoPlaysArray[i].split(" ").includes("5-10") && offset < 5) {
          offset = 5;
        } else if (
          whoPlaysArray[i].split(" ").includes("10-20") &&
          offset < 10
        ) {
          offset = 10;
        } else if (
          whoPlaysArray[i].split(" ").includes("20-30") &&
          offset < 20
        ) {
          offset = 20;
        }
      }
      let pingTime;
      if (timeToPlay - interaction.message.createdTimestamp < 0) {
        pingTime = 0 + offset * 60 * 1000;
      } else
        pingTime =
          timeToPlay -
          interaction.message.createdTimestamp +
          offset * 60 * 1000;
      players = userArray.join("  ");
      setTimeout(() => {
        channel.send(
          userArray.length +
            1 +
            " joueurs seront bientôt disponibles: " +
            players +
            " et " +
            `<@${interaction.user.id}>`
        );
      }, pingTime);
      if (pingTime > 0) {
        return interaction.reply(
          `${
            userArray.length + 1
          } joueurs seront bientôt prêts et se feront ping dans ${Math.round(
            pingTime / 1000 / 60
          )} minutes`
        );
      } else return await interaction.deferUpdate();
    } else return await interaction.deferUpdate();
  },
};
