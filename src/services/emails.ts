import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { validate } from 'email-validator';
import credenciaisJson from '../private/EmailCredentials.json'; // Importa o JSON com um nome adequado
import { Credenciais } from '../types/types'; 
import EmailConfig from '../config/emails_config'// Importa a interface para as credenciais

// Typing para o JSON importado
const credenciais = credenciaisJson as Credenciais;

class EmailService {
  private transporter: Transporter;

  constructor() {
    const { email, password, service } = credenciais;

    this.transporter = EmailConfig
    
  }

  public async sendConfirmationCode(recipient: string, code: string): Promise<boolean> {
    try {
      const emailValid = await this.check_email(recipient);
      if (!emailValid.valid) {
        console.error('Invalid email:', emailValid.reason);
        return false;
      }

      const mailOptions: SendMailOptions = {
        from: credenciais.email,
        to: recipient,
        subject: "Jhon Doe confirmation code",
        html: `<h1 style="font-weight:normal;">Welcome to Jhon Doe platform. Your confirmation code is <strong>${code}</strong></h1>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation code sent successfully', info.response);
      return true;
    } catch (error) {
      console.error('Error sending confirmation code:', error);
      return false;
    }
  }

  public async send_message(recipient: string, content: string): Promise<boolean> {
    try {
      const emailValid = await this.check_email(recipient);
      if (!emailValid.valid) {
        console.error('Invalid email:', emailValid.reason);
        return false;
      }

      const mailOptions: SendMailOptions = {
        from: credenciais.email,
        to: recipient,
        subject: "Answer from Jhon Doe",
        html: `<p>${content}</p>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent successfully:', info.response);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  public async send_message_code(recipient: string, password: string): Promise<boolean> {
    try {
      const emailValid = await this.check_email(recipient);
      if (!emailValid.valid) {
        console.error('Invalid email:', emailValid.reason);
        return false;
      }

      const mailOptions: SendMailOptions = {
        from: credenciais.email,
        to: recipient,
        subject: "Jhon Doe",
        html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
                Esta é a sua nova senha: <strong>${password}</strong>. Tenha cuidado para guardá-la com segurança e, por segurança, apague esta mensagem após visualizá-la.
              </p>
           `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent successfully:', info.response);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }  

  public async check_email(email: string): Promise<{ valid: boolean, reason?: string }> {
    if (!validate(email)) {
      return { valid: false, reason: "Invalid email format" };
    }

    return { valid: true };
  }
}

export default EmailService;
