import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { verificationemail } from "../email/template/verification.email.js";
export const emailEvent = new EventEmitter();
emailEvent.on("sendConfirmationEmail", async (data) => {
  const { email, otp } = data;
  const html = verificationemail({ code: otp });
  await sendEmail({
    to: email,
    subject: "confirm email",
    html,
  });

  console.log("email sent");
});
