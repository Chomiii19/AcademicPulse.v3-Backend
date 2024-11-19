import nodemailer from "nodemailer";
import IUser from "../@types/userInterface";
import userVerification from "./template/verifyEmailTemplate";
import addCollab from "./template/addCollabTemplate";

const sendMail = async function (
  subject: string,
  receiver: IUser,
  type: "verifyAccount" | "addCollab",
  token: string
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

    const mailOptions = {
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

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendMail;
