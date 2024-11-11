import { error } from "console";
import { LogRepository } from "../../repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCalback: SuccessCallback,
    private readonly errorCalback: ErrorCallback
  ) {}

  async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) {
        throw new Error(`HTTP error! status: ${req.status}`);
      }

      const log = new LogEntity({
        message: `Service ${url} Working`, 
        level: LogSeverityLevel.low,
        origin: 'check-service.ts',
      });
      this.logRepository.saveLog(log);
      this.successCalback && this.successCalback();

      return true;
    } catch (error) {
      const errorMessage = `${error}`
      const log = new LogEntity({
        message: `Service ${url} Failed: ${errorMessage}`,
        level: LogSeverityLevel.medium, 
        origin: 'check-service.ts',
      });
      this.logRepository.saveLog(log);
      this.errorCalback && this.errorCalback(errorMessage);
      return false;
    }
  }
}
