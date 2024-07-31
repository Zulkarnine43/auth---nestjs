import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordReset {
  @IsNotEmpty({ message: 'Password field was required' })
  password: string;
  @IsNotEmpty({ message: 'Token field was required' })
  token: string;
}

export class ForgetPasswordEmail {
  @IsNotEmpty({ message: 'Email field was required' })
  @IsEmail(undefined, { message: 'Invalid Email Address' })
  email: string;
}
