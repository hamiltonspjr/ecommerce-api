const User = require("../models/User");
module.exports = {
  private: async (req, res, next) => {
    // verificando se na query ou body foi enviado o token
    if (!req.query.token && !req.body.token && !req.headers.authorization) {
      res.json({ notallowed: true });
      return;
    }

    let token = "";
    if (req.query.token) {
      token = req.query.token;
    }
    if (req.body.token) {
      token = req.body.token;
    }
    if (req.headers.authorization) {
      token = req.headers.authorization;
    }
    if (token == "") {
      res.json({ notallowed: true });
      return;
    }
    // procurando o usuário através do token
    const user = await User.findOne({ token });

    if (!user) {
      res.json({ notallowed: true });
      return;
    }
    next();
  },
};
