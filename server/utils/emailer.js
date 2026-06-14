const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"Nayepankh" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
}

async function sendWelcomeEmail(user) {
  const html = `
    <h1>Welcome to Nayepankh, ${user.name}!</h1>
    <p>Thank you for joining our community. We are excited to have you on board.</p>
    <p>You can now explore volunteer opportunities and events.</p>
    <p>Best regards,<br/>The Nayepankh Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Nayepankh',
    html
  });
}

async function sendApprovalEmail(user) {
  const html = `
    <h1>Congratulations, ${user.name}!</h1>
    <p>Your profile has been approved. You can now fully participate in all activities.</p>
    <p>Start exploring events and contributing to our mission.</p>
    <p>Best regards,<br/>The Nayepankh Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Profile Approved',
    html
  });
}

async function sendEventReminder(user, event) {
  const html = `
    <h1>Event Reminder: ${event.title}</h1>
    <p>Dear ${user.name},</p>
    <p>This is a reminder that the event <strong>${event.title}</strong> is happening soon.</p>
    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
    <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
    <p>We look forward to seeing you there!</p>
    <p>Best regards,<br/>The Nayepankh Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: `Reminder: ${event.title}`,
    html
  });
}

async function sendInternshipStatusEmail(intern, status) {
  const message = status === 'approved'
    ? 'We are pleased to inform you that your internship application has been approved.'
    : 'We regret to inform you that your internship application has been rejected.';

  const html = `
    <h1>Internship Application ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
    <p>Dear ${intern.name},</p>
    <p>${message}</p>
    <p>Thank you for your interest in our internship program.</p>
    <p>Best regards,<br/>The Nayepankh Team</p>
  `;

  return sendEmail({
    to: intern.email,
    subject: `Internship Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html
  });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendApprovalEmail,
  sendEventReminder,
  sendInternshipStatusEmail
};
