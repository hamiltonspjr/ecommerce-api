const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const modelSchema = new mongoose.Schema({
  idUser: String,
  nameUser: String,
  comment: String,
  dateCreated: Date,
  idProduct: String,
});

const modelName = "Comment";

// verifica se tem conexão e se tem esse model na conexão
if (mongoose.connection && mongoose.connection.models[modelName]) {
  module.exports = mongoose.connection.models[modelName];
} else {
  module.exports = mongoose.model(modelName, modelSchema);
}
