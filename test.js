const nodemailer = require('nodemailer');

const sendEmail = (email) => {
  return new Promise((resolve, reject) => {

    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.com',
      port: 587,
      secure: false,
      auth: {
          user: 'bigsilversstar@yandex.com',
          pass: 'big1992'
      }
    })

    let mailOptions = {
      from: "bigsilversstar@yandex.com",
      to: 'li_dev@mailinator.com',
      subject: 'Testing',
      text: 'Testing text!!!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }          
    });
  });
}

sendEmail().then(() => {
  console.log('Sending success.')
}).catch((err) => {
  console.log(err)
})