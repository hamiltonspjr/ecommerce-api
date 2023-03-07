const { checkSchema } = require("express-validator");

module.exports = {
  edit: checkSchema({
    token: {
      notEmpty: true,
    },
    name: {
      optional: true,
      trim: true,
      isLength: {
        options: { min: 2 },
      },
      errorMessage: "Nome precisa ter pelo menos dois caracteres",
    },
    email: {
      optional: true,
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "E-mail inválido",
    },
    password: {
      optional: true,
      isLength: {
        options: { min: 8 },
      },
      errorMessage: "Senha precisa ter pelo menos 8 caracteres",
    },
    cep: {
      optional: true,
      notEmpty: true,
      isLength: {
        options: { min: 8 },
      },
      errorMessage: "CEP não preenchido e/ou inválido",
    },
    rua: {
      optional: true,
      notEmpty: true,
      errorMessage: "Rua não preenchida",
    },
    numero: {
      optional: true,
      notEmpty: true,
      errorMessage: "Número não preenchido",
    },
    bairro: {
      optional: true,
      notEmpty: true,
      errorMessage: "Bairro não preenchido",
    },
    cidade: {
      optional: true,
      notEmpty: true,
      errorMessage: "Cidade não preenchida",
    },
    estado: {
      optional: true,
      notEmpty: true,
      errorMessage: "Estado não preenchido",
    },
  }),
};
