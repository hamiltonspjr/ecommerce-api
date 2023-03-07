const express = require("express");
const router = express.Router();

const Auth = require("./middlewares/Auth");

const AuthValidator = require("./validators/AuthValidator");
const UserValidator = require("./validators/UserValidator");

const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const CommentController = require("./controllers/CommentController");
const TransactionController = require("./controllers/TransactionController");
const EmailController = require("./controllers/EmailController");

router.post("/user/signin", AuthValidator.signin, AuthController.signin);
router.post("/user/signup", AuthValidator.signup, AuthController.signup);

router.get("/user/me", Auth.private, UserController.info);
router.put("/user/me", UserValidator.edit, Auth.private, UserController.edit);
router.delete("/user/me", Auth.private, UserController.delete);

router.get("/ping", (req, res) => {
  res.json({ pong: true });
});

router.post("/product/add", Auth.private, ProductController.addProduct);
router.get("/product/list", ProductController.getList);
router.get("/product/user", Auth.private, ProductController.getListUser);
router.get("/product/:id", ProductController.getItem);
router.post("/product/:id", Auth.private, ProductController.edit);
router.delete("/product/:id", ProductController.delete);

router.post("/transaction/:id", Auth.private, TransactionController.buy);
router.get(
  "/transaction/purchases",
  Auth.private,
  TransactionController.getPurchases
);
router.get("/transaction/sales", Auth.private, TransactionController.getSales);

router.post("/comment/add", Auth.private, CommentController.add);
router.put("/comment/:id", Auth.private, CommentController.edit);
router.delete("/comment/:id", Auth.private, CommentController.delete);

// rota de email
router.post("/contact", Auth.private, EmailController.env);

module.exports = router;
