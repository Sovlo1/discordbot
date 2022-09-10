const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barrestatus")
    .setDescription("voir combien de barre possède un utilisateur")
    .addUserOption((option) =>
      option
        .setName("qui")
        .setDescription("précisez de qui vous voulez voir le compteur")
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log(interaction.options.getUser("qui"));
    User.findOne({ userId: interaction.options.getUser("qui").id }).then(
      (user) => {
        if (!user) {
          interaction.reply("Cet utilisateur n'a pas encore de barres");
        } else {
          interaction.reply(`${user.username} a ${user.barres} barres.`);
        }
      }
    );
  },
};
