const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/usermodel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crotte")
    .setDescription("Ajouter un caca au compteur de crotte"),
  async execute(interaction) {
    console.log(interaction.user.id);
    await User.findOne({ userId: interaction.user.id }).then(async (user) => {
      let userShown;
      console.log(user);
      if (!user) {
        const newUser = new User({
          userId: interaction.user.id,
          username: interaction.user.username,
          crottes: 1,
          barres: 0,
        });

        await newUser.save();
        userShown = newUser;
      } else if (user) {
        if (user.crottes) {
          let updateCrotteCount = {
            $inc: { crottes: 1 },
          };
          await User.findOneAndUpdate(
            { userId: interaction.user.id },
            { ...updateCrotteCount },
            { returnOriginal: false }
          )
            .then((updatedUser) => {
              console.log("succesfully updated user");
              userShown = updatedUser;
            })
            .catch((err) => console.log(err));
        } else {
          await User.findOneAndUpdate(
            { userId: interaction.user.id },
            { crottes: 1 },
            { returnOriginal: false }
          )
            .then((updatedUser) => {
              console.log("succesfully updated user");
              userShown = updatedUser;
            })
            .catch((err) => console.log(err));
        }
      }
      console.log(userShown);
      interaction.reply(
        `${interaction.user.username} vient de crotter ce qui porte son total de crottes de l'année à ${userShown.crottes}`
      );
    });
  },
};
