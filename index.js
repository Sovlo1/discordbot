<<<<<<< HEAD
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.commands = new Collection();
client.menus = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const menusPath = path.join(__dirname, "menus");
const menuFiles = fs
  .readdirSync(menusPath)
  .filter((file) => file.endsWith(".js"));

for (const file of menuFiles) {
  const filePath = path.join(menusPath, file);
  const menu = require(filePath);
  client.menus.set(menu.data.name, menu);
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
  } else if (interaction.isSelectMenu()) {
    const menu = interaction.client.menus.get(interaction.customId);
    console.log(menu);
    if (!menu) return;
    try {
      await menu.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
    // let time = Date.now();
    // if (time - interaction.message.createdTimestamp > 60 * 60 * 1000)
    //   return await interaction.reply({
    //     content:
    //       "Ce ping est trop ancien, veuillez en relancer un en utilisant /dota ou vous manifester sur un ping plus récent.",
    //     ephemeral: true,
    //   });
    // let players;
    // let message = await interaction.message.fetch(interaction.message.id);
    // let messageArray = message.content.split(" ");
    // let whoPlaysArray = message.content.split("\n");
    // let whoPlaysUpdated = whoPlaysArray
    //   .filter((x) => !x.includes(interaction.user.id))
    //   .join("\n");
    // const userIdRegex = /(<@[0-9]+>)/;
    // let userArray = messageArray
    //   .map((x) => {
    //     if (userIdRegex.test(x)) {
    //       return x;
    //     } else return;
    //   })
    //   .filter((x) => typeof x === "string");
    // if (
    //   interaction.values[0] == "un instant" &&
    //   !interaction.message.content.includes(interaction.user.id)
    // ) {
    //   await message.edit(
    //     interaction.message.content +
    //       " \n " +
    //       `<@${interaction.user.id}>` +
    //       " sera dispo dans " +
    //       interaction.values[0]
    //   );
    // } else if (
    //   interaction.values[0] == "5-10" &&
    //   !interaction.message.content.includes(interaction.user.id)
    // ) {
    //   await message.edit(
    //     interaction.message.content +
    //       " \n " +
    //       `<@${interaction.user.id}>` +
    //       " sera dispo dans " +
    //       interaction.values[0]
    //   );
    // } else if (
    //   interaction.values[0] == "10-20" &&
    //   !interaction.message.content.includes(interaction.user.id)
    // ) {
    //   await message.edit(
    //     interaction.message.content +
    //       " \n " +
    //       `<@${interaction.user.id}>` +
    //       " sera dispo dans " +
    //       interaction.values[0]
    //   );
    // } else if (
    //   interaction.values[0] == "20-30" &&
    //   !interaction.message.content.includes(interaction.user.id)
    // ) {
    //   await message.edit(
    //     interaction.message.content +
    //       " \n " +
    //       `<@${interaction.user.id}>` +
    //       " sera dispo dans " +
    //       interaction.values[0]
    //   );
    // } else if (
    //   interaction.values[0] == "quit" &&
    //   interaction.message.content.includes(interaction.user.id)
    // ) {
    //   await message.edit(whoPlaysUpdated);
    // } else {
    //   return await interaction.reply({
    //     content:
    //       "Si vous voulez changer d'option il faut d'abord selectionner 'le monde a changé...' puis choisir une nouvelle option",
    //     ephemeral: true,
    //   });
    // }
    // if (userArray.length >= 4 && interaction.values[0] != "quit") {
    //   players = userArray.join(" ");
    //   return await interaction.reply(
    //     userArray.length +
    //       1 +
    //       " joueurs sont dispo soon: " +
    //       players +
    //       " et " +
    //       `<@${interaction.user.id}>`
    //   );
    // }
    // return await interaction.deferUpdate();
  } else return;
});

client.login(process.env.CLIENT_TOKEN);
=======
>>>>>>> parent of 863921b (Bonjour)
