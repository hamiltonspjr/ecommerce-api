const { v4: uuidv4 } = require("uuid");
const jimp = require("jimp");

const User = require("../models/User");
const Product = require("../models/Product");
const Comment = require("../models/Comment");

// função para manipular imagem
const addImage = async (buffer) => {
  let newName = `${uuidv4()}.jpg`;
  let tmpImg = await jimp.read(buffer);
  tmpImg.cover(415, 623).quality(80).write(`./public/media/${newName}`);
  return newName;
};

module.exports = {
  addProduct: async (req, res) => {
    // dados que serão pegos da requisição
    let { name, description, price, token } = req.body;
    // pegando o usuário
    const user = await User.findOne({ token }).exec();

    // verificações básicas
    if (!name || !description) {
      res.json({ error: "Nome e/ou descrição não foram preenchidos" });
    }

    if (price) {
      price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
      price = parseFloat(price);
    } else {
      price = 0;
    }

    // adicionado o produto ao banco
    const newProduct = new Product();
    newProduct.idUser = user._id;
    newProduct.name = name;
    newProduct.description = description;
    newProduct.price = price;
    newProduct.vendido = false;
    newProduct.dateCreated = new Date();
    newProduct.views = 0;

    // verificando images
    if (req.files && req.files.img) {
      if (req.files.img.length == undefined) {
        if (
          ["image/jpeg", "image/jpg", "image/png"].includes(
            req.files.img.mimetype
          )
        ) {
          let url = await addImage(req.files.img.data);
          newProduct.images.push({
            url,
            default: false,
          });
        }
      } else {
        for (let i = 0; i < req.files.img.length; i++) {
          if (
            ["image/jpeg", "image/jpg", "image/png"].includes(
              req.files.img[i].mimetype
            )
          ) {
            let url = await addImage(req.files.img[i].data);
            newProduct.images.push({
              url,
              default: false,
            });
          }
        }
      }
    }

    if (newProduct.images.length > 0) {
      newProduct.images[0].default = true;
    }

    // salvando no banco
    const info = await newProduct.save();
    res.json({ id: info._id });
  },
  getList: async (req, res) => {
    let { offset = 0, limit = 8, q } = req.query;
    let total = 0;
    // criando funções para filtrar os produtos
    let filters = { vendido: false };

    if (q) {
      filters.name = { $regex: q, $options: "i" };
    }

    // saber quantos produtos tem no total
    const productsTotal = await Product.find(filters).exec();
    total = productsTotal.length;

    const productsData = await Product.find(filters)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .exec();

    // montando os dados da resposta da requisição
    let products = [];
    for (let i in productsData) {
      let image;

      let defaultImg = productsData[i].images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`;
      }
      products.push({
        id: productsData[i]._id,
        name: productsData[i].name,
        description: productsData[i].description,
        price: productsData[i].price,
        image,
      });
    }
    res.json({ products, total });
  },
  getListUser: async (req, res) => {
    let token = req.query.token;
    const user = await User.find({ token });
    let id = user[0]._id;

    // criando funções para filtrar os produtos
    let filters = { idUser: id };

    const productsData = await Product.find(filters).exec();

    // montando os dados da resposta da requisição
    let products = [];
    for (let i in productsData) {
      let image;

      let defaultImg = productsData[i].images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`;
      }
      products.push({
        id: productsData[i]._id,
        name: productsData[i].name,
        description: productsData[i].description,
        price: productsData[i].price,
        image,
      });
    }
    res.json({ products });
  },
  getItem: async (req, res) => {
    let { id } = req.params;
    // verificar se tem o id
    if (!id) {
      res.json({ error: "Sem produto" });
      return;
    }

    if (id.length < 12) {
      res.json({ error: "ID inválido" });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.json({ error: "Produto inexistente" });
      return;
    }

    // incrementando a quantidade de views
    product.views++;
    await product.save();

    // pegar as imagens do produto
    let images = [];
    for (let i in product.images) {
      images.push(`${process.env.BASE}/media/${product.images[i].url}`);
    }

    // pegando os comentários do produto

    const comments = await Comment.find({ idProduct: product._id }).exec();

    res.json({
      id: product._id,
      idUser: product.idUser,
      name: product.name,
      description: product.description,
      price: product.price,
      dateCreated: product.dateCreated,
      views: product.views,
      vendido: product.vendido,
      images,
      comments,
    });
  },
  edit: async (req, res) => {
    // pegando informações

    // na url
    let { id } = req.params;
    // no body
    let { name, description, price, images, token } = req.body;
    // verificar se o id é valido
    if (id.length < 12) {
      res.json({ error: "ID inválido" });
      return;
    }
    const product = await Product.findById(id).exec();

    if (!product) {
      res.json({ error: "Product inexistente" });
      return;
    }

    // verificar se o produto é do usuario logado
    const user = await User.findOne({ token }).exec();
    if (user._id.toString() !== product.idUser) {
      res.json({ error: "Este produto não é seu" });
      return;
    }

    // atualizar o produto

    if (name) {
      product.name = name;
    }

    if (description) {
      product.description = description;
    }
    if (price) {
      price = price.replace(".", ",").replace(",", ".").replace("R$ ", "");
      price = parseFloat(price);
      product.price = price;
    }

    if (images) {
      product.images = images;
    }

    await product.save();

    res.json({ error: "" });
  },
  delete: async (req, res) => {
    let id = req.params.id;
    let token = req.headers.authorization;
    if (!token) {
      res.json({ error: "Você não possui permissão" });
      return;
    }
    const product = await Product.findById(id).exec();

    // verificar se o produto é do usuario logado
    const user = await User.findOne({ token }).exec();
    if (user._id.toString() !== product.idUser) {
      res.json({ error: "Este produto não é seu" });
      return;
    }
    await product.remove();
    //await Product.findOneAndDelete({ id });

    res.json({});
  },
};
