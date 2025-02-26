import nodemailer, { Transporter } from 'nodemailer';
import credenciaisEmail from '../private/EmailCredentials.json';
import { config } from 'dotenv';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });
interface EmailCredentials {
  email: string;
  password: string;
  service:string;
} 

class EmailService {
  private transporter: Transporter;

  constructor(credentials: EmailCredentials) {
    this.transporter = nodemailer.createTransport({
      service:process.env.SERVICE_EMAIL ||`${credentials.service}`,
      auth: {
        user:process.env.EMAIL || `${credentials.email}`,
        pass:process.env.PASSWORD_EMAIL || `${credentials.password}`
      },
      tls: {
        rejectUnauthorized: false // Ignorar certificado autoassinado (use apenas para desenvolvimento)
      }
    });
  }

  public getTransporter(): Transporter {
    return this.transporter;
  }
}

const emailService = new EmailService(credenciaisEmail as EmailCredentials);

export default emailService.getTransporter();
