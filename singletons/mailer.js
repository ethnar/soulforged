const nodeMailer = require("nodemailer");
const fs = require("fs");

if (!program.test) {
  let mailProperties;
  try {
    mailProperties = JSON.parse(
      fs.readFileSync(".credentials/mail-credentials.json")
    );
  } catch (e) {
    utils.error("Unable to load mailing configuration!");
    return;
  }

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: mailProperties.user,
      pass: mailProperties.password
    }
  });

  module.exports = {
    send(to, subject, message) {
      let mailOptions = {
        from: `Soulforged - service <${mailProperties.user}>`,
        to: to,
        subject: subject,
        text: message,
        html: message
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });
    }
  };
}
