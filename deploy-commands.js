const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId, guildId } = require("./config.json");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder().setName("dota").setDescription("Ping pour dota"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
