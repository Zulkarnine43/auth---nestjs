import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ForgetPasswordEmail,
  ForgetPasswordReset,
} from '../dto/forgot-password.dto';
import { MailService } from '../services/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // send email
  @Post('test')
  async test(@Req() req, @Body() body: any) {
    try {
      return await this.mailService.sendTestMail(body);
    } catch (error) {
      throw new error(error.message, error.status);
    }
  }

  // forgot password
  @Post('forget-password/send-email')
  async forgetUserPasswordEnterEmail(
    @Req() req: any,
    @Body()
    forgetPasswordEmail: ForgetPasswordEmail,
  ) {
    return this.mailService.forgetUserPasswordEnterEmail(forgetPasswordEmail);
  }

  @Post('forget-password/verify-and-reset')
  async forgetUserPasswordAndReset(
    @Req() req: any,
    @Body()
    forgetPasswordReset: ForgetPasswordReset,
  ) {
    return this.mailService.forgetUserPasswordAndReset(forgetPasswordReset);
  }
}
