const nodemailer = require("nodemailer");

module.exports = {
  env: async (req, res) => {
    let { name, email, subject, text } = req.body;
    // configurar o transporter(servidor smtp)
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "721b619019c699",
        pass: "ec25baecd2f65f",
      },
    });
    // configurar a mensagem
    let message = {
      from: `${name} <${email}>`,
      to: "hamiltonjunior111@gmail.com",
      subject: subject,
      html: text,
      text: text,
    };
    // enviar a mensagem
    let info = await transport.sendMail(message);
    res.json({ success: true });
  },
};
