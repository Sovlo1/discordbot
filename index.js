require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { memoryStorage } = require("multer");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
const pingedRecently = new Set();

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    console.log(interaction.user);
    const user = interaction.user;
    const message = interaction.message;
    const meufQuiSouffle = message.guild.emojis.cache.find(
      (emoji) => emoji.name === "cutecopium"
    );
    console.log(interaction.message);
    // interaction.message.content.update(" ");
    // ({ content: "" });
  } else return;
});

client.login(process.env.CLIENT_TOKEN);
