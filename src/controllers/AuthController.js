const bcrypt = require("bcrypt");

const { validationResult, matchedData } = require("express-validator");
const User = require("../models/User");

module.exports = {
  signin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    const data = matchedData(req);

    // validando o email
    const user = await User.findOne({ email: data.email });

    if (!user) {
      res.json({ error: "E-mail e/ou senha errados!" });
      return;
    }

    // validando a senha
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      res.json({ error: "E-mail e/ou senha errados!" });
      return;
    }

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    user.token = token;
    await user.save();

    res.json({ token, email: data.email });
  },
  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }

    const data = matchedData(req);

    // verificar se já possui um usuário com o email cadastrado
    const user = await User.findOne({
      email: data.email,
    });
    if (user) {
      res.json({
        error: { email: { msg: "E-mail já cadastrado!" } },
      });
      return;
    }

    // criado o usuário

    // senha criptografada
    const passwordHash = await bcrypt.hash(data.password, 10);

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    const newUser = new User({
      name: data.name,
      email: data.email,
      password: passwordHash,
      token,
      cep: data.cep,
      rua: data.rua,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
    });

    await newUser.save();

    res.json({ token });
  },
};
