import { INotificationService } from '../../common/interfaces/INotificationService.js';
import { logger } from '../../common/utils/logger.js';

export class EmailService implements INotificationService {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        // In production, use nodemailer or SES SDK
        logger.info(`[EmailService] Sending email to ${to} with subject "${subject}"`);
        // logger.debug(`[EmailService] Body: ${body}`);
        return true;
    }

    async sendSMS(to: string, message: string): Promise<boolean> {
        logger.info(`[EmailService] Sending SMS to ${to}: ${message}`);
        return true;
    }
}

export const notificationService = new EmailService();
