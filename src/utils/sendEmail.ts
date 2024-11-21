import nodemailer from "nodemailer";
import { Request } from "express";
import path from "path";
import IUser from "../@types/userInterface";
import userVerification from "./template/verifyEmailTemplate";
import addCollab from "./template/addCollabTemplate";
import schoolVerification from "./template/verifySchoolTemplate";

const sendMail = async function (
  subject: string,
  receiver: IUser,
  type: "verifyAccount" | "addCollab" | "verifySchool",
  token: string,
  req?: Request
) {
  try {
    const email = process.env.EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    let mailOptions;
    if (type === "verifySchool") {
      const filePath = req?.file
        ? path.resolve(__dirname, "../dev/data", req.file.filename)
        : "";

      mailOptions = {
        from: {
          name: "Technological University of the Philippines - Manila",
          address: email,
        },
        to: [process.env.EMAIL],
        subject: subject,
        text: "",
        html: schoolVerification(receiver.email, token),
        attachments: req?.file
          ? [
              {
                filename: req.file.originalname,
                path: filePath,
              },
            ]
          : [],
      };
    } else {
      mailOptions = {
        from: {
          name: "Technological University of the Philippines - Manila",
          address: email,
        },
        to: [receiver.email],
        subject: subject,
        text: "",
        html: `${
          type === "verifyAccount"
            ? userVerification(receiver.firstname, token)
            : addCollab(receiver.firstname, token)
        }`,
      };
    }

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendMail;
