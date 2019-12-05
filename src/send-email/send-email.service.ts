import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';
import * as config from 'config';

const baseUrl = config.get('base').url;
const sgApiKey = config.get('key').sendGrid;

sgMail.setApiKey(sgApiKey);

@Injectable()
export class SendEmailService {
  async emailVerification(token: string, to: string): Promise<void> {
    try {
      const endpoint = `${baseUrl}/auth/verify/email?token=${token}`;
      const message: MailData = {
        to: to,
        from: 'Geldstroom <no-reply@cotcapp.my.id>',
        subject: 'Confirm Email',
        text: `To verify your email click here: ${endpoint}`,
        html: `<strong>To verify your email click <a href="${endpoint}">here</a></strong>`,
      };
      await sgMail.send(message);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
