const nodemailer = require("nodemailer");

// Q. I am getting this error "invalid_grant: Bad Request" with this code, can you check what is issue with this
const sendEmail = (sender, receiver) => {
  const user = "asumalkushwah2003@gmail.com";
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;
  const url = process.env.URL;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  let mailOptions = {
    from: `"I-Notebook" <${user}>`,
    to: receiver,
    subject: "I-Notebook",
    html: `<p><b>${sender} shared notes with you</b> <br/> check here, <br/> <a href=${url}>${url}</a></p>`,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error in sending email " + err);
    } else {
      console.log("Email sent successfully");
      console.log(data);
    }
  });
};

module.exports = sendEmail;
