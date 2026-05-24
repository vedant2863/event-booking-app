import nodemailer from 'nodemailer';

import { config } from '../config/env';
import { logger } from '../utils/logger';

export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

export class SmtpEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(private readonly smtpConfig = config.smtp) {
    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      auth: { user: smtpConfig.user, pass: smtpConfig.pass },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!this.smtpConfig.user) {
        logger.info(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
      }

      await this.transporter.sendMail({
        from: this.smtpConfig.from,
        to,
        subject,
        html,
      });

      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error('Email send failed:', error);
    }
  }
}

export class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string) {
    logger.info(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    logger.debug(html);
  }
}
