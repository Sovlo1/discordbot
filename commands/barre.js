const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barre")
    .setDescription("Mettre une barre à quelqu'un")
    .addUserOption((option) =>
      option
        .setName("à")
        .setDescription("Pour préciser à qui")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("combien")
        .setDescription("Pour savoir combien de barre ajouter au compteur")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.user.id != "208682670551597056") {
      interaction.reply({
        content: "Interdit de mettre des barres",
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
              barres: 0 + interaction.options.getNumber("combien"),
            });
            console.log(newUser);
            newUser
              .save()
              .then(() => console.log("added user to db"))
              .catch((err) => console.log(err));
          } else if (user) {
            let updateBarreCount = {
              $inc: { barres: interaction.options.getNumber("combien") },
            };
            console.log(updateBarreCount);
            User.updateOne(
              { userId: interaction.options.getUser("à").id },
              { ...updateBarreCount }
            )
              .then(() => console.log("succesfully updated user"))
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
      let pluralCheck;
      if (
        interaction.options.getNumber("combien") <= 1 &&
        interaction.options.getNumber("combien") >= -1
      ) {
        pluralCheck = "barre";
      } else pluralCheck = "barres";
      interaction.reply(
        `${
          interaction.user.username
        } vient de mettre ${interaction.options.getNumber(
          "combien"
        )} ${pluralCheck} à ${interaction.options.getUser("à").username}`
      );
    }
  },
};
