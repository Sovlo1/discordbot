require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const cron = require("cron");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
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

client.on("ready", async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("connected to database");
      },
      (err) => {
        console.log(err);
      }
    );
  console.log(`Logged in as ${client.user.tag}!`);
  const cacaSchedule = new cron.CronJob(
    "0 7 */1 * *",
    () => {
      client.channels.cache
        .get("229696890860470281")
        .send(`Avez vous procédé au caca du matin??????`);
    },
    true
  );
  cacaSchedule.start();
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
  } else return;
});

client.on("messageCreate", async (interaction) => {
  console.log(interaction);
  if (interaction.author.bot) {
    return false;
  }

  let splitMessage = interaction.content.split(" ");
  console.log(splitMessage);
  let filteredMessage = splitMessage
    .map((x) => {
      if (x.startsWith("https://twitter")) {
        let splitX = x.split("//");
        console.log(x);
        splitX[1] = "//fx" + splitX[1];
        return splitX.join("");
      } else if (x.startsWith("https://x.")) {
        console.log("oui");
        let splitX = x.split("//x");
        console.log(x);
        splitX[1] = "//fxtwitter" + splitX[1];
        return splitX.join("");
      }
    })
    .filter((y) => y !== undefined);

  if (filteredMessage.length > 0) {
    client.channels.cache.get(interaction.channelId).send(filteredMessage[0]);
  }

  let lastWord = splitMessage.pop().replace(/[\W_]+/g, "");
  console.log(splitMessage);
  let regExp = /[a-zA-Z]/g;
  if (!regExp.test(lastWord)) {
    lastWord = splitMessage.pop().replace(/[\W_]+/g, "");
  }
  if (
    lastWord.toLowerCase() === "quoi" ||
    lastWord.toLowerCase() === "koi" ||
    lastWord.toLowerCase() === "qoi" ||
    lastWord.toLowerCase() === "koa" ||
    lastWord.toLowerCase() === "aqua" ||
    lastWord.toLowerCase() === "pourquoi"
  ) {
    client.channels.cache.get(interaction.channelId).send("feur xD");
  }

  if (lastWord.toLowerCase() === "feur") {
    client.channels.cache
      .get(interaction.channelId)
      .send("Vraiment drole ça..................................");
  }
});

client.login(process.env.CLIENT_TOKEN);
