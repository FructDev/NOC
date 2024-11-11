import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugins';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachments[];
}

interface Attachments {
    filename: string;
    path: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })

    constructor (
    ) {}

    async sendEmail(option: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody, attachments = [] } = option;

        try {

            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments
            })

            const log = new LogEntity({
                message: `Email sent successfully to ${to} with subject "${subject}"`,
                level: LogSeverityLevel.low,
                origin: 'email.service.ts',
            })

            // console.log(sentInformation)

            return true;
        } catch (error) {
            
            const log = new LogEntity({
                message: `Email not sent successfully. ${error}`,
                level: LogSeverityLevel.high,
                origin: 'email.service.ts',
            })

            return false;
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]) {
        const subject = 'Log files from NOC application';
        const htmlBody = `
            <h1>Log files from NOC application</h1>
            <p>This is a summary of the logs from the NOC application.</p>
            <p>Please find attached the log files.</p>
        `;
        const attachments: Attachments[] = [
            {filename: 'logs-all.log', path: './logs/logs-all.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
            {filename: 'logs-high.log', path: './logs/logs-high.log'}
        ];
        
        return this.sendEmail({to, subject, htmlBody, attachments});
    }

}