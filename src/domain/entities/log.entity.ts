export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface LogEntityOptions {
  level: LogSeverityLevel;
  message: string;
  origin: string
  createdAt?: Date;
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public origin: string; 
  public createdAt: Date; 

  constructor(options:LogEntityOptions) {

    const {message, level, origin, createdAt } = options;

    this.message = message;
    this.level = level;
    this.origin = origin; 
    this.createdAt = new Date();
  }

  static fromJson(json: string): LogEntity {
    const {message, level, createdAt = new Date() } = JSON.parse(json);

    const log = new LogEntity({
      message: message, 
      level: level,
      createdAt: createdAt,
      origin: origin
    });
    log.createdAt = new Date(createdAt);

    return log;

  }

}
