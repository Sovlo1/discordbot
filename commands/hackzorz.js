const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hackzorz")
    .setDescription("h4ck3rm4n")
    .addStringOption((option) =>
      option
        .setName("qui")
        .setDescription("Indiquer qui vous souhaitez h4ckz0rz")
        .setRequired(true)
    ),
  async execute(interaction) {
    getRandomIP = (min, max) => {
      const baseIp = [];
      min = Math.ceil(min);
      max = Math.floor(max);
      for (i = 0; i < 4; i++) {
        baseIp.push(Math.floor(Math.random() * (max - min) + min));
      }
      const ipBeginning = baseIp.join(".");
      const port = Math.floor(Math.random() * (25000 - 10000) + 10000);
      const finalIp = [ipBeginning];
      finalIp.push(port);
      return finalIp.join(":");
    };
    console.log(interaction);
    interaction.reply(
      `L'adresse IP de ${interaction.options.getString("qui")} est ` +
        getRandomIP(256, 10)
    );
  },
};
