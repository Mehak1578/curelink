const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail({ to, subject, text, html }){
  if(!process.env.EMAIL_USER) return console.warn('Email not configured');
  return transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text, html });
}

module.exports = { sendMail };
