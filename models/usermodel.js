const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  barres: { type: Number, default: 0 },
  boites: [ type: Number, default: 0 }, //TODO: sauf si c'est pasko il faudrait mettre 1
  stars: [ type: Number, default: 0 },
});

module.exports = mongoose.model("user", userSchema);
