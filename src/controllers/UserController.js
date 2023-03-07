const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = {
  info: async (req, res) => {
    // pegar informações do usuário
    let token = req.query.token;
    const user = await User.findOne({ token });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      cep: user.cep,
      rua: user.rua,
      numero: user.numero,
      bairro: user.bairro,
      cidade: user.cidade,
      estado: user.estado,
    });
  },
  edit: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    const data = matchedData(req);
    let token = req.body.token;
    //let updates = {};
    let user = await User.findOne({ token });

    // pegando os dados que serão atualizaods
    if (data.name) {
      user.name = data.name;
    }

    if (data.email) {
      const emailCheck = await User.findOne({ email: data.email });
      if (emailCheck) {
        res.json({ error: "E-mail já cadastrado" });
        return;
      }
      user.email = data.email;
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    if (data.cep) {
      user.cep = data.cep;
    }

    if (data.rua) {
      user.rua = data.rua;
    }

    if (data.numero) {
      user.numero = data.numero;
    }

    if (data.bairro) {
      user.bairro = data.bairro;
    }

    if (data.cidade) {
      user.cidade = data.cidade;
    }

    if (data.estado) {
      user.estado = data.estado;
    }
    await user.save();

    res.json({});
  },
  delete: async (req, res) => {
    let token = req.headers.authorization;
    let user = await User.findOne({ token }).exec();
    await user.remove();

    res.json({});
  },
};
