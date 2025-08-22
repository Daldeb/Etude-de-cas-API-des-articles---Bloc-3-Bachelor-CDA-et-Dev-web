const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  status: {
    type: String,
    enum: {
      values: ["draft", "published"],
      message: "{VALUE} n'est pas un statut valide"
    },
    default: "draft"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

let Article;

module.exports = Article = model("Article", articleSchema);