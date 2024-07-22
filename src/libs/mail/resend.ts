// re_UoH9XNRQ_5FG88E5PcEt8vouaMBvRbcah

import { Resend } from "resend";

const resend = new Resend("re_UoH9XNRQ_5FG88E5PcEt8vouaMBvRbcah");
export const sendEmail = (toReceiver: string, ReceiverName: string) => {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: `${toReceiver}`,
    subject: "Registration Successful - Welcome to Speedmedia Studio",
    html: `
      <p>Hi ${ReceiverName},</p>
  
      <p>Congratulations on successfully registering with Speedmedia Studio!</p>
      
      <p>
        Professional lighting, video reel, and image production are ever-trending media solutions that will never fade out.
        Speedmedia Studio is giving you a great opportunity to acquire these invaluable skills. Whether you want to enhance
        your own abilities or refer someone who needs this expertise, we are here to help.
      </p>
      
      <p>
        With our training, you can reach new heights and achieve great success wherever you go. Don't miss out on this
        incredible chance to boost your career.
      </p>
      
      <p>
        Register today and call us at: <br/>
        08066925006 <br/>
        09081880505
      </p>
      
      <p>Best regards,</p>
      <p>Speedmedia Studio Team</p>
    `,
  });
};
