export enum LogLevel {
  TRACE,
  INFO,
  WARN,
  ERROR,
  DEBUG,
}

export interface LogDTO {
  level: LogLevel;
  message: string;
  data?: string | Record<string, any>; // JSON string or parsed object
  category: string;
}
