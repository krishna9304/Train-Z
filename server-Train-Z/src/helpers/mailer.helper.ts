import { ObjectId } from "mongoose";
import nodemailer, { Transporter } from "nodemailer";
import { tokenGenerator } from "./jwt.helper";

export const emailVerificationBody = (
  Name: string,
  _id: ObjectId | string,
  userType: string
): string => {
  const verificationtoken = tokenGenerator(
    _id,
    `${userType}_EMAIL_VERIFICATION`
  );

  return `<div style="justify-content: center; align-items: center; flex-direction: column; text-align: center; background-color: #191920; color: #fff; padding: 20px;" >
            <h1 style="color: #fff;">
              Hi ${Name},
            </h1>
            <br/>
            <p style="color: #fff; display:flex; justify-content:center; align-item:center; flex-direction:row;">
              Thanks for getting started with Train-Z !
            <br />
            We need a little more information to complete your registration, including a confirmation of your email address.
        </p>
            <br/>
            <p style="color: #fff;">
              Click below to confirm your email address:
              <br/>
              <div style="padding:1rem;">
                <a
                href="http://localhost:8080/auth/emailverification/${verificationtoken}" 
                style="padding:0.5rem; padding-top:0.1rem; padding-bottom:0.1rem; border-radius: 4px; background-color: #047857; color: #ffffff; text-decoration:none; font-size: 20pt" 
                >
                  VERIFY NOW
                </a>
              </div>
              <br/>
              <p style="color: #fff" >
                If you have problems, please open the above URL in your web browser.
                <br/>
                If you did not signup for Train-Z, you should just ignore this message.
              </p>
            </p>
            <p style="color: #fff"  >
              This is an auto-generated mail used for Train-Z
            </p>
          </div>`;
};

function mail(to: string, body: string): Promise<any> {
  //! Requires EMAIL & EMAIL_PASS in .env
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

  return new Promise((resolve, reject) => {
    transporter
      .sendMail({
        from: `"Train-Z" ${process.env.MAIL}`,
        to: to,
        subject: "Account Verification",
        html: body,
      })
      .then((info) => {
        console.log("MAIL SENT TO", to);
        resolve(info);
      })
      .catch(reject);
  });
}

export default mail;
