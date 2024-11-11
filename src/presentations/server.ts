import { CheckService } from "../domain/use-cases/check/check-service";
import { sendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSystemDatasources } from "../infrastructure/datasources/file-system.datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasources()
);

const emailService = new EmailService();


export class Server {
  public static start() {
    console.log("Server running");

    // new sendEmailLogs(emailService, fileSystemLogRepository).execute("lfcafn@gmail.com");
    
    // emailService.sendEmailWithFileSystemLogs("lf1.%cafn@admin.com123");
    // emailService.sendEmail({
    //   to: 'lfcafn@gmail.com',
    //   subject: 'Esto es desde la app NOC',
    //   htmlBody: 'Es una pruba para ver la efectividad de esta aplicacion en nodeJs'
    // });


    // CronService.createJob(
    //   "*/5 * * * * *",
    //   () => {
    //     const url = "https://www.google.com"; // Replace with your own URL
    //     new CheckService(
    //       fileSystemLogRepository,
    //       () => console.log(`URL ${url} is accessible`),
    //       (err) => console.error(err)
    //     ).execute(`${url}`);
    //     // new CheckService().execute("http://localhost:3000");
    //   }
    // );
  }
}
