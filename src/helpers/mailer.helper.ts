import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";

interface Mail {
  to: string;
  verifierlink: string;
}

async function mail({ to, verifierlink }: Mail) {
  const body = `<div style="justify-content: center; align-items: center; flex-direction: column; text-align: center; background-color: #191920; color: #fff; padding: 20px;" >
        <h1>
            Hello from Train-Z,
        </h1>
        <br/>
        <p>
            This email is sent to you because you registered yourself in the \`Road Rakshak\` application.
            To Verify your account click on the link below
        </p>
        <br/>
        <a href="${verifierlink}" >
            <h1>
                Verify
            </h1>
        </a>
        <p>This is an auto-generated mail used for Road Rakshak</p>
    </div>`;

  //!Requires EMAIL & EMAIL_PASS in .env
  let transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  let info: SentMessageInfo = await transporter.sendMail({
    from: `"Train-Z" ${process.env.MAIL}`,
    to: to,
    subject: "Account Verification",
    html: body,
  });
}

module.exports = mail;
