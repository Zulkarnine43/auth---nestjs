import { Module } from '@nestjs/common';
import { MailController } from './controller/mail.controller';
import { MailService } from './services/mail.service';
import { MailjetService } from './services/mailjet.service';
import { SMTPService } from './services/smtp.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService, MailjetService, SMTPService],
  exports: [MailService],
})
export class MailModule {}
