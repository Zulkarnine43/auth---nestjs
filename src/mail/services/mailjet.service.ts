import { Injectable } from '@nestjs/common';
import * as modeMailjet from 'node-mailjet';
const mailjet = new modeMailjet.Client({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

@Injectable()
export class MailjetService {
  async sendEmail(data: modeMailjet.SendEmailV3_1.Body) {
    try {
      const result = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);
        // console.log('email', result);
    } catch (error) {
      console.log(error);
    }
  }
}
