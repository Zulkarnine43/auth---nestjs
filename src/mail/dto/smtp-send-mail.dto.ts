import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SmtpSendMailDto {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsOptional()
  attachments?: any[];
}
