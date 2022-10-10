const DateTimeRecognizers = require("@microsoft/recognizers-text-date-time");
var Recognizers = require("@microsoft/recognizers-text-suite");

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
    console.log(whoPlaysArray[0]);
    let whens = Recognizers.recognizeDateTime(
      whoPlaysArray[0],
      Recognizers.Culture.French
    );
    console.log(whens);
    // console.log(whens[0].resolution.values[0].value);
    // if (whens.length === 2)
    if (
      interaction.values[0] == "un instant" &&
      !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n " +
          `<@${interaction.user.id}>` +
          " sera dispo dans " +
          interaction.values[0]
      );
    } else if (interaction.values[0] == "5-10") {
      await message.edit(
        interaction.message.content +
          " \n " +
          `<@${interaction.user.id}>` +
          " sera dispo dans " +
          interaction.values[0]
      );
    } else if (
      interaction.values[0] == "10-20" &&
      !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n " +
          `<@${interaction.user.id}>` +
          " sera dispo dans " +
          interaction.values[0]
      );
    } else if (
      interaction.values[0] == "20-30" &&
      !interaction.message.content.includes(interaction.user.id)
    ) {
      await message.edit(
        interaction.message.content +
          " \n " +
          `<@${interaction.user.id}>` +
          " sera dispo dans " +
          interaction.values[0]
      );
    } else if (
      interaction.values[0] == "quit" &&
      interaction.message.content.includes(interaction.user.id)
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
      players = userArray.join(" ");
      interaction.reply(
        userArray.length +
          1 +
          " joueurs sont dispo soon: " +
          players +
          " et " +
          `<@${interaction.user.id}>`
      );
    } else return await interaction.deferUpdate();
  },
};
