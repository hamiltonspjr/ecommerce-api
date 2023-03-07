const { checkSchema } = require("express-validator");

module.exports = {
  signup: checkSchema({
    name: {
      trim: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Nome precisa ter pelo menos dois caracteres",
    },
    email: {
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "E-mail inválido",
    },
    password: {
      isLength: {
        options: { min: 8 },
      },
      errorMessage: "Senha precisa ter pelo menos 8 caracteres",
    },
    cep: {
      notEmpty: true,
      isLength: {
        options: { min: 8 },
      },
      errorMessage: "CEP não preenchido e/ou inválido",
    },
    rua: {
      notEmpty: true,
      errorMessage: "Rua não preenchida",
    },
    numero: {
      notEmpty: true,
      errorMessage: "Número não preenchido",
    },
    bairro: {
      notEmpty: true,
      errorMessage: "Bairro não preenchido",
    },
    cidade: {
      notEmpty: true,
      errorMessage: "Cidade não preenchida",
    },
    estado: {
      notEmpty: true,
      errorMessage: "Estado não preenchido",
    },
  }),
  signin: checkSchema({
    email: {
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "E-mail inválido",
    },
    password: {
      isLength: {
        options: { min: 8 },
      },
      errorMessage: "Senha precisa ter pelo menos 8 caracteres",
    },
  }),
};
