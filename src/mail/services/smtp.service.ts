import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SmtpSendMailDto } from '../dto/smtp-send-mail.dto';

@Injectable()
export class SMTPService {
  constructor() {}

  async sendEmail(data: SmtpSendMailDto) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const info = await transporter.sendMail({
        from: {
          name: process.env.SMTP_FROM_NAME,
          address: process.env.SMTP_FROM_EMAIL,
        },
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log(error);
    }
  }
}
