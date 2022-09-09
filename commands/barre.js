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
    // if (interaction.user.id != "208682670551597056") {
    //   interaction.reply({
    //     content: "Interdit de mettre des barres",
    //     ephemeral: true,
    //   });
    // }
    // if (!barreData.includes(interaction.options.getUser("à"))) {
    // }
    console.log(typeof interaction.options.getUser("à").id);
    console.log(typeof interaction.options.getNumber("combien"));
    // User.findById(interaction.options.getUser("à").id)
    //   .then((user) => {
    //     if (!user) {
    //       const newUser = new User({
    //         userId: interaction.options.getUser("à").id,
    //         barres: 0 + interaction.options.getNumber("combien"),
    //       });
    //       newUser
    //         .save()
    //         .then(() => console.log("added user to db"))
    //         .catch((err) => console.log(err));
    //     } else if (user) {
    //       const updateBarreCount = {
    //         $inc: { barres: +interaction.options.getNumber("combien") },
    //       };
    //       User.updateOne(
    //         { userId: interaction.options.getUser("à").id },
    //         { updateBarreCount }
    //       )
    //         .then(() => console.log("succesfully updated user"))
    //         .catch((err) => console.log(err));
    //     }
    //   })
    //   .catch((err) => console.log(err));
  },
};
