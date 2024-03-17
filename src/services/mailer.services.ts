import nodemailer from 'nodemailer';
import mailerCfg from '../config/mailer.config';

const mailer = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport(mailerCfg);

    await transporter.sendMail({
      from: mailerCfg.auth.user,
      to,
      subject,
      text,
    });

    return { success: true };

  } catch(err: any) {
    return { success: false, message: err.message }
  }
}

export default mailer;