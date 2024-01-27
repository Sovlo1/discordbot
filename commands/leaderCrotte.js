const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leadercrotte")
    .setDescription("Voir les crottes de tout le monde"),
  async execute(interaction) {
    User.find()
      .sort({ crottes: "desc" })
      .then((users) => {
        console.log(users);
        let leaderboard = [];
        for (i = 0; i < users.length; i++) {
          let pluralCheck;
          if (!users[i].crottes || users[i].crottes === 0) {
            continue;
          }
          if (users[i].crottes <= 1 && users[i].crottes >= -1) {
            pluralCheck = "crotte";
          } else pluralCheck = "crottes";
          leaderboard.push(
            `${i + 1}: ${users[i].username} avec ${
              users[i].crottes
            } ${pluralCheck} \n`
          );
          console.log(leaderboard);
        }
        interaction.reply(leaderboard.join(""));
      })
      .catch((err) => console.error(err));
  },
};
