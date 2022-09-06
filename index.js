require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    console.log(command);
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
  } else if (interaction.isSelectMenu()) {
    if (interaction.message.content.includes(interaction.user.id))
      return interaction.reply({
        content: "Vous avez déja choisi une option ducon",
        ephemeral: true,
      });
    let players;
    let message = await interaction.message.fetch(interaction.message.id);
    let messageArray = message.content.split(" ");
    const userIdRegex = /(<@[0-9]+>)/;
    let userArray = messageArray
      .map((x) => {
        if (userIdRegex.test(x)) {
          return x;
        } else return;
      })
      .filter((x) => typeof x === "string");
    let messageUpdate = await message.edit(
      interaction.message.content +
        " \n " +
        `<@${interaction.user.id}>` +
        " sera dispo dans " +
        interaction.values[0]
    );
    if (interaction.values[0] == "5-10") {
      messageUpdate;
    } else if (interaction.values[0] == "10-20") {
      messageUpdate;
    } else if (interaction.values[0] == "20-30") {
      messageUpdate;
    } else if (interaction.values[0] == "30-45") {
      messageUpdate;
    } else if (interaction.values[0] == "45-60") {
      messageUpdate;
    }
    if (userArray.length >= 4) {
      players = userArray.join(" ");
      return await interaction.reply(
        userArray.length +
          1 +
          " joueurs sont dispo bientôt soon: " +
          players +
          " et " +
          `<@${interaction.user.id}>`
      );
    }
    interaction.deferUpdate();
  } else return;
});

client.login(process.env.CLIENT_TOKEN);
