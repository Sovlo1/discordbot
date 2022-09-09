const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("star")
    .setDescription("Mettre une étoile à quelqu'un")
    .addUserOption((option) =>
      option
        .setName("à")
        .setDescription("Pour préciser à qui")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("combien")
        .setDescription("Pour savoir combien de escargots ajouter au compteur")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.user.id != "208682670551597056") {
      interaction.reply({
        content: "Interdit de mettre des étoiles",
        ephemeral: true,
      });
    } else {
      console.log(interaction.options.getUser("à"));
      User.findOne({ userId: interaction.options.getUser("à").id })
        .then((user) => {
          if (!user) {
            const newUser = new User({
              userId: interaction.options.getUser("à").id,
              username: interaction.options.getUser("à").username,
              stars: 0 + interaction.options.getNumber("combien"),
            });
            console.log(newUser);
            newUser
              .save()
              .then(() => console.log("added user to db"))
              .catch((err) => console.log(err));
          } else if (user) {
            let updateStarsCount = {
              $inc: { stars: interaction.options.getNumber("combien") },
            };
            console.log(updateStarsCount);
            User.updateOne(
              { userId: interaction.options.getUser("à").id },
              { ...updateStarsCount }
            )
              .then(() => console.log("succesfully updated user"))
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
      interaction.reply(
        `${
          interaction.user.username
        } vient de mettre ${interaction.options.getNumber(
          "combien"
        )} stars à ${interaction.options.getUser("à").username}`
      );
    }
  },
};
