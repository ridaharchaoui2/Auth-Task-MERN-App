import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Create a transporter using your email service (e.g., Gmail, SendGrid, Mailgun)
  const transporter = nodemailer.createTransport({
    service: "gmail", // OR use host/port for other providers
    auth: {
      user: process.env.EMAIL_USER, // Put this in your .env
      pass: process.env.EMAIL_PASS, // Put this in your .env
    },
  });

  const mailOptions = {
    from: `"Task App" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
