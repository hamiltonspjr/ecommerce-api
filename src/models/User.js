const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const modelSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  cep: Number,
  rua: String,
  numero: Number,
  bairro: String,
  cidade: String,
  estado: String,
});

const modelName = "User";

// verifica se tem conexão e se tem esse model na conexão
if (mongoose.connection && mongoose.connection.models[modelName]) {
  module.exports = mongoose.connection.models[modelName];
} else {
  module.exports = mongoose.model(modelName, modelSchema);
}
