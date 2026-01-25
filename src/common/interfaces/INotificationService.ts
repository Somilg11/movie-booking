export interface INotificationService {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
    sendSMS(to: string, message: string): Promise<boolean>;
}
