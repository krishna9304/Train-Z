import { ObjectId } from "mongoose";
import nodemailer, { Transporter } from "nodemailer";
import { tokenGenerator } from "./jwt.helper";

export const emailVerificationBody = (
  name: string,
  _id: ObjectId | string,
  userType: string
): { body: string; subject: string } => {
  const verificationtoken = tokenGenerator(
    _id,
    `${userType}_EMAIL_VERIFICATION`
  );

  return {
    body: `<div style="justify-content: center; align-items: center; flex-direction: column; text-align: center; background-color: #191920; color: #fff; padding: 20px;" >
            <h1 style="color: #fff;">
              Hi ${name},
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
          </div>`,
    subject: "Email verification",
  };
};

export const resetPasswordBody = (
  name: string,
  _id: ObjectId | string,
  userType: string
): { body: string; subject: string } => {
  const verificationtoken = tokenGenerator(_id, `${userType}_RESET_PASSWORD`);

  return {
    body: `<div marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="text-align:center;">
                        <img width="60" src="https://cdn.filestackcontent.com/ARVNFDkIFTCy2nOXvYSoLz/security=policy:eyJleHBpcnkiOjE2NTM5NDgwMDB9,signature:08aafeb16f44bba501b0ddd33d6932fdd523af5bdf62a163b78f0a7e5eb54be7/v2Yi0EoUTZGTN1IcI3rb" title="Train-Z"
                        alt="Train-Z">
                      </td>
                    </tr>
                    <tr>
                      <td style="height:20px;">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                          style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                          <tr>
                            <td style="padding:0 35px;">
                              <h1
                                style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                Hi ${name},
                                <br/>
                                You have requested to reset your password
                              </h1>
                              <span
                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                A unique link to reset your password has been generated for you.
                                <br/>
                                To reset your password, click the
                                following link and follow the instructions.
                              </p>
                              <a href="http://localhost:8080/auth/resetpassword/${verificationtoken}"
                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                <strong>
                                  Reset Password
                                </strong>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="height:40px;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    <tr>
                      <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="text-align:center;">
                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                          <strong>
                            trainz.herokuapp.com
                          </strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:80px;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!--/100% body table-->
          </div>`,
    subject: "Password reset",
  };
};

function mail(
  to: string,
  { body, subject }: { body: string; subject: string }
): Promise<any> {
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
        subject: subject,
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
