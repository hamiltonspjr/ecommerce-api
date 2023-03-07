const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  add: async (req, res) => {
    let { token, comment, idProduct } = req.body;
    // pegando o usuário
    const user = await User.findOne({ token }).exec();

    // verificações básicas
    if (!comment) {
      res.json({ error: "Comentário não preenchido!" });
    }

    // adicionado o comentário ao banco
    const newComment = new Comment();
    newComment.idUser = user._id;
    newComment.nameUser = user.name;
    newComment.comment = comment;
    newComment.dateCreated = new Date();
    newComment.idProduct = idProduct;

    // salvando no banco
    const info = await newComment.save();
    res.json({ id: info._id });
  },
  edit: async (req, res) => {
    // pegando informações

    // na url
    let { id } = req.params;
    // no body
    let { token, comment } = req.body;
    // verificar se o id é valido
    if (id.length < 12) {
      res.json({ error: "ID inválido" });
      return;
    }

    if (comment < 2) {
      res.json({ error: "Comentário deve conter no mínimo 2 caracteres" });
      return;
    }

    const commentBanco = await Comment.findById(id);

    // verificar se o comentário é do usuario logado
    const user = await User.findOne({ token }).exec();
    if (user._id.toString() !== commentBanco.idUser) {
      res.json({ error: "Este comentário não é seu" });
      return;
    }

    // atualizar o comentário

    if (comment) {
      commentBanco.comment = comment;
    }

    await commentBanco.save();

    res.json({ error: "" });
  },
  delete: async (req, res) => {
    let { id } = req.params;
    let token = req.headers.authorization;
    const comment = await Comment.findById(id).exec();

    // verificar se o produto é do usuario logado
    const user = await User.findOne({ token }).exec();
    if (user._id.toString() !== comment.idUser) {
      res.json({ error: "Este comentário não é seu" });
      return;
    }
    await comment.remove();

    res.json({});
  },
};
