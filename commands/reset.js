const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("remettre un utilisateur à 0 barre")
    .addUserOption((option) =>
      option
        .setName("à")
        .setDescription("Pour préciser à qui")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.user.id != "208682670551597056") {
      interaction.reply({
        content: "Interdit de mettre des barres.",
        ephemeral: true,
      });
    } else {
      console.log(interaction.options.getUser("à"));
      User.findOne({ userId: interaction.options.getUser("à").id })
        .then((user) => {
          if (!user) {
            interaction.reply({
              content:
                "Cet utilisateur n'est dans pas dans la base de donnée ou n'a pas de barre au compteur.",
              ephemeral: true,
            });
          } else if (user) {
            let updateBarreCount = {
              barres: 0,
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
      interaction.reply(
        `${
          interaction.user.username
        } vient de remettre à zéro le nombre de barres de ${
          interaction.options.getUser("à").username
        }`
      );
    }
  },
};
