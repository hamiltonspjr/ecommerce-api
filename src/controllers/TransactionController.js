const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

module.exports = {
  buy: async (req, res) => {
    let productId = req.params.id;
    let token = req.body.token;
    const user = await User.findOne({ token }).exec();
    const product = await Product.findById(productId);

    const newTransaction = new Transaction();
    newTransaction.idUser = user._id.toString();
    newTransaction.idVendedor = product.idUser;
    newTransaction.product = product;

    product.vendido = true;
    await product.save();

    const infoTransaction = await newTransaction.save();
    res.json({ id: infoTransaction._id });
  },
  getPurchases: async (req, res) => {
    let { token } = req.query;
    const user = await User.findOne({ token }).exec();
    const transactionList = await Transaction.find({ idUser: user._id }).exec();

    let transaction = [];

    for (let i in transactionList) {
      const vendedor = await User.findById(transactionList[i].product.idUser);
      let image;

      let defaultImg = transactionList[i].product.images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`;
      }

      transaction.push({
        emailVendedor: vendedor.email,
        product: {
          id: transactionList[i].product._id,
          price: transactionList[i].product.price,
          name: transactionList[i].product.name,
          image,
        },
        endereco: {
          rua: user.rua,
          numero: user.numero,
          bairro: user.bairro,
          cidade: user.cidade,
          estado: user.estado,
        },
      });
    }

    res.json({ transaction });
  },
  getSales: async (req, res) => {
    let { token } = req.query;
    const user = await User.findOne({ token }).exec();
    const transactionList = await Transaction.find({
      idVendedor: user._id,
    }).exec();

    let transaction = [];

    for (let i in transactionList) {
      const comprador = await User.findById(transactionList[i].idUser);
      let image;

      let defaultImg = transactionList[i].product.images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`;
      }

      transaction.push({
        emailComprador: comprador.email,
        product: {
          id: transactionList[i].product._id,
          price: transactionList[i].product.price,
          name: transactionList[i].product.name,
          image,
        },
        endereco: {
          rua: comprador.rua,
          numero: comprador.numero,
          bairro: comprador.bairro,
          cidade: comprador.cidade,
          estado: comprador.estado,
        },
      });
    }

    res.json({ transaction });
  },
};
