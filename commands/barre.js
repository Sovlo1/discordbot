const { SlashCommandBuilder } = require("discord.js");

const barreData = new Set();

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
    barreData.add(interaction.options.getUser("à"));
    console.log(barreData);
    // }
  },
};
