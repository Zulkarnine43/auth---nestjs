import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateOrderDto } from '../dto/create-order.dto';
import { MailjetService } from './mailjet.service';
import { SMTPService } from './smtp.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailjet: MailjetService,
    private readonly smtpService: SMTPService,
    @InjectConnection() private readonly knex: Knex,
  ) {}
  async sendTestMail(data: any) {
    // const mailData = {
    //   Messages: [
    //     {
    //       From: {
    //         Email: process.env.MJ_SENDER_EMAIL,
    //       },
    //       To: [
    //         {
    //           Email: 'ashadulmridhaprog@gmail.com',
    //         },
    //       ],
    //       Subject: 'Your email flight plan!',
    //       HTMLPart:
    //         '<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
    //       TextPart:
    //         'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
    //     },
    //   ],
    // };
    // return await this.mailjet.sendEmail(mailData);
    const mailData = {
      to: 'zulkarnine43@gmail.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1>',
    };
    return await this.smtpService.sendEmail(mailData);
  }

  // send email to user with unique token
  async forgetUserPasswordEnterEmail(resetUserPasswordData) {
    try {
      // find a user who has this email/username
      const userExists = await this.knex
        .table('user')
        .where('email', '=', resetUserPasswordData.email)
        .where('status', '=', 'active')
        .first();
      if (userExists && userExists.id) {
        //  generated random string
        const randomStr = (Math.random() * 5).toString(36).substring(2);

        //generated random string hashed
        let hashedRandomString = CryptoJS.AES.encrypt(
          randomStr,
          process.env.APP_SECREAT_KEY,
        ).toString();
        hashedRandomString = hashedRandomString
          .replace(new RegExp('\\+', 'g'), 'xMl3Jk')
          .replace(new RegExp('\\/', 'g'), 'Por21Ld')
          .replace(new RegExp('\\=', 'g'), 'Ml32');

        // genarate expaire time current time + 30 minutes
        const expaireTime = new Date(new Date().getTime() + 30 * 60000);

        const insertData = {
          user_id: userExists.id,
          type: 'user',
          token: randomStr,
          expaire_in: expaireTime,
        };

        // console.log('insertData', insertData);

        // genarate reset password link
        const resetPasswordLink = `${process.env.FRONTEND_URL}auth/reset-password?reset_token=${hashedRandomString}`;
        // find for this user already send reset link
        const findForgetLinkAlreadySend = await this.knex
          .table('forget_pass')
          .where('type', 'user')
          .where('user_id', '=', userExists.id)
          .first();

        if (findForgetLinkAlreadySend && findForgetLinkAlreadySend.id) {
          console.log('findForgetLinkAlreadySend', findForgetLinkAlreadySend);

          const forgetLinkUpdate = await this.knex
            .table('forget_pass')
            .where('id', findForgetLinkAlreadySend.id)
            .update(insertData);
          // if data update
          if (forgetLinkUpdate) {
            const email = userExists.email;
            const image = `${process.env.BACKEND_URL}images/logo/logo-long.png`;
            const templatePath = './template/forget-password.hbs';
            const source = fs.readFileSync(templatePath, 'utf-8');
            const templateHtml = Handlebars.compile(source)({
              userExists,
              resetPasswordLink,
              image,
            });
            // const mail = {
            //   to: email,
            //   subject: 'Reset password for Acceler8 Training',
            //   from: {
            //     email: process.env.SENDER_EMAIL,
            //     name: process.env.SENDER_NAME,
            //   },
            //   html: templateHtml,
            // };
            // const mailData = {
            //   Messages: [
            //     {
            //       From: {
            //         Email: process.env.MJ_SENDER_EMAIL,
            //         Name: 'Anzaar',
            //       },
            //       To: [
            //         {
            //           Email: email,
            //         },
            //       ],
            //       Subject: 'Reset password for Anzaar',
            //       HTMLPart: templateHtml,
            //     },
            //   ],
            // };
            // await this.mailjet.sendEmail(mailData);

            // this.sendgridService.send(mail);
            const mailData = {
              to: email,
              subject: 'Reset password for GNG',
              html: templateHtml,
            };
            await this.smtpService.sendEmail(mailData);
            return {
              status: true,
              statusCode: 200,
              message: 'Check Your Email',
              // link: resetPasswordLink,
            };
          }
        } else {
          console.log('findForgetLinkAlreadySend', findForgetLinkAlreadySend);

          const forgetLinkInsert = await this.knex
            .table('forget_pass')
            .insert(insertData);

          // if data update
          if (forgetLinkInsert) {
            const image = `${process.env.BACKEND_URL}images/logo/logo-long.png`;
            const email = userExists.email;
            const templatePath = './template/forget-password.hbs';
            const source = fs.readFileSync(templatePath, 'utf-8');
            const templateHtml = Handlebars.compile(source)({
              userExists,
              resetPasswordLink,
              image,
            });
            // const mailData = {
            //   Messages: [
            //     {
            //       From: {
            //         Email: process.env.MJ_SENDER_EMAIL,
            //       },
            //       To: [
            //         {
            //           Email: email,
            //         },
            //       ],
            //       Subject: 'Reset password for GNG',
            //       HTMLPart: templateHtml,
            //     },
            //   ],
            // };
            // await this.mailjet.sendEmail(mailData);

            const mailData = {
              to: email,
              subject: 'Reset password for GNG',
              html: templateHtml,
            };
            await this.smtpService.sendEmail(mailData);

            // this.sendgridService.send(mail);
            return {
              status: true,
              statusCode: 200,
              message: 'Check Your Email',
              // link: resetPasswordLink,
            };
          }
        }
      } else {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`${error.message}`, error.status);
    }
  }

  // get password and update password
  async forgetUserPasswordAndReset(forgetPasswordResetData) {
    try {
      // decrypt token
      let dcToken = forgetPasswordResetData.token;
      dcToken = dcToken
        .toString()
        .replace(new RegExp('\\xMl3Jk', 'g'), '+')
        .replace(new RegExp('\\Por21Ld', 'g'), '/')
        .replace(new RegExp('\\Ml32', 'g'), '=');

      const token = CryptoJS.AES.decrypt(
        dcToken,
        process.env.APP_SECREAT_KEY,
      ).toString(CryptoJS.enc.Utf8);

      // return token;
      const date = new Date();

      //know token exits and not expaire
      const isTokenExits = await this.knex
        .table('forget_pass')
        .where('token', '=', token)
        .where('expaire_in', '>', date)
        .first();
      if (isTokenExits) {
        // password generated hashed
        const hashedPassword = await bcrypt.hash(
          forgetPasswordResetData.password,
          10,
        );
        const updatePassword = { password: hashedPassword };
        const userPassChnage = await this.knex
          .table('user')
          .where('id', '=', isTokenExits.user_id)
          .update(updatePassword);
        if (userPassChnage) {
          return {
            status: true,
            message: 'password update successfull',
          };
        }
      } else {
        throw new HttpException(`Token Inavalid`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(`${error.message}`, error.status);
    }
  }

  // send user email for custom order from admin
  async sendOrderEmail(createOrderDto: CreateOrderDto) {
    console.log('createOrderEmail', createOrderDto);
    try {
      const templatePath = './template/custom-order.hbs';
      const source = fs.readFileSync(templatePath, 'utf-8');
      // logo
      const logo = `${process.env.APP_URL}/uploads/images/logo/anzaar.png`;
      const templateHtml = Handlebars.compile(source)({
        userName: createOrderDto.userName,
        link: createOrderDto.link,
        orderNumber: createOrderDto.orderNumber,
        logo,
      });

      // const mailData = {
      //   Messages: [
      //     {
      //       From: {
      //         Email: process.env.MJ_SENDER_EMAIL,
      //         Name: 'Anzaar Lifestyle',
      //       },
      //       To: [
      //         {
      //           Email: createOrderDto.email,
      //         },
      //       ],
      //       Subject: 'Order create from anzaar lifestyle!',
      //       HTMLPart: templateHtml,
      //     },
      //   ],
      // };
      // return await this.mailjet.sendEmail(mailData);
      const mailData = {
        to: createOrderDto.email,
        subject: 'Order create from anzaar lifestyle!',
        html: templateHtml,
      };
      return await this.smtpService.sendEmail(mailData);
    } catch (error) {
      console.log('error', error);
    }
  }
}
