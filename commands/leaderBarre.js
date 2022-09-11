const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderbarre")
    .setDescription("voir les barres de tout le monde"),
  async execute(interaction) {
    User.find()
      .sort({ barres: "desc" })
      .then((users) => {
        console.log(users);
        let leaderboard = [];
        for (i = 0; i < users.length; i++) {
          let pluralCheck;
          if (users[i].barres <= 1 && users[i].barres >= -1) {
            pluralCheck = "barre";
          } else pluralCheck = "barres";
          leaderboard.push(
            `${i + 1}: ${users[i].username} avec ${
              users[i].barres
            } ${pluralCheck} \n`
          );
          console.log(leaderboard);
        }
        interaction.reply(leaderboard.join(""));
      })
      .catch((err) => console.error(err));
  },
};
