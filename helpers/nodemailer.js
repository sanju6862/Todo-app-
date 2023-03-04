  
const jwt = require('jsonwebtoken'); // to generate JSON web token
const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// eslint-disable-next-line require-jsdoc
async function sendEmail(user) {
  const emailToken = jwt.sign({
    user: user.id,
    email: user.email,
  }, process.env.NODEMAILER_TOKEN, {
    expiresIn: '7d',
  });

  const url = `http://localhost:3000/confirm/${emailToken}`;

  const output = `<div>Hey,</br>
  Welcome to ToDoTimer, your simple and flexible to-do list for work,</br>
  home and everywhere else.</br> 
  Please confirm your email address to get full access to ToDoTimer.</div> 
    <a href="${url}">Confirm Now</a>
    <div>Thanks for being part of ToDoTimer:)</div>`;

  // Send mail with defined transport object.
  const info = await transporter.sendMail({
    from: '"todotimer 👻" <dariacodedev@gmail.com>',
    to: user.email,
    subject: 'Confirm your email',
    html: output,
  });
  console.log('Message sent: %s', info.messageId);
};

// eslint-disable-next-line require-jsdoc
async function sendPasswordEmail(user) {
  const emailToken = jwt.sign({
    user: user.id,
    email: user.email,
  }, process.env.NODEMAILER_PASSWORD_TOKEN, {
    expiresIn: '7d',
  });

  const url = `http://localhost:3000/resetPassword/${emailToken}`;

  const output = `<div>Hey,</br>
  You have requested to reset your password on ToDoTimer.</br>
  Please click the following button to reset your password.</div> 
    <a href="${url}">Reset Now</a>`;

  // Send mail with defined transport object.
  const info = await transporter.sendMail({
    from: '"todotimer 👻" <dariacodedev@gmail.com>',
    to: user.email,
    subject: 'Reset Password',
    html: output,
  });
  console.log('Message sent: %s', info.messageId);
};

module.exports = {
  sendEmail, sendPasswordEmail,
};
