import  fs from "fs";

import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasources implements LogDatasource {

  private readonly logsPath: string       = "logs/";
  private readonly allLogsPath: string    = "logs/logs-all.log";
  private readonly mediumLogsPath: string = "logs/logs-medium.log";
  private readonly highLogsPath: string   = "logs/logs-high.log";

  constructor() {
    this.createLogFiles();
  }

  private createLogFiles() {
    if (!fs.existsSync(this.logsPath)) {
      fs.mkdirSync(this.logsPath);
    }

    [
      this.allLogsPath,
      this.mediumLogsPath,
      this.highLogsPath
    ].forEach(path => {
      if(fs.existsSync(path)) return;

      fs.writeFileSync(path, "");
    })
  }

  private getLosFromFile(path: string): LogEntity[] {
    const content = fs.readFileSync(path, 'utf-8')
    const logs = content.split('\n').map(log => LogEntity.fromJson(log))

    return logs;
  }

  async saveLog(newLog: LogEntity): Promise<void> {

    const logAsJson = `${JSON.stringify(newLog)}\n`;
    
    fs.appendFileSync(this.allLogsPath, logAsJson);

    if(newLog.level === LogSeverityLevel.low) return;

    if(newLog.level === LogSeverityLevel.medium) {
      fs.appendFileSync(this.mediumLogsPath, logAsJson);
    } else {
      fs.appendFileSync(this.highLogsPath, logAsJson);
    }

  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    
    switch (severityLevel)  {
      case LogSeverityLevel.low:
        return this.getLosFromFile(this.allLogsPath);

      case LogSeverityLevel.medium:
        return this.getLosFromFile(this.mediumLogsPath);

      case LogSeverityLevel.high:
        return this.getLosFromFile(this.highLogsPath);

      default:
        throw new Error("Invalid severity level");
    }

  }
}
