const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  barres: { type: Number, default: 0 },
});

module.exports = mongoose.model("user", userSchema);
