const nodeMailer = require("nodemailer");

const adminEmail = "gdinu79@gmail.com";
const adminPassword = "btylninkonpsjwbf";

const mailHost = "smtp.gmail.com";

const mailPort = 587;

const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent,
  });

  return info;
};

module.exports = {
  sendMail,
};
