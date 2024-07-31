import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
    private static mail_settings = {
        mail_settings: {
            sandbox_mode: {
                enable:
                    process.env.EMAIL_SANDBOX_MODE === 'true' ? true : false,
            },
        },
    };

    constructor() {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendEmail(mail: SendGrid.MailDataRequired) {
        try {
            // Merge mail settings with existing mail object
            const mailWithSettings = {
                ...mail,
                ...SendgridService.mail_settings,
            };
            mailWithSettings.bcc = [process.env.SENDGRID_BCC_EMAIL];

            // Send the email
            await SendGrid.send(mailWithSettings);

            // Return the sent mail
            // return mailWithSettings;
        } catch (error) {
            console.log(error);
            // throw new HttpException("Internal server error", 500);
        }
    }
}
