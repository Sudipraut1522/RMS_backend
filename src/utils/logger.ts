type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  info(message: string, ...meta: any[]): void {
    console.log(this.formatMessage('info', message), ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    console.warn(this.formatMessage('warn', message), ...meta);
  }

  error(message: string, error?: any, ...meta: any[]): void {
    console.error(this.formatMessage('error', message), ...meta);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }

  debug(message: string, ...meta: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage('debug', message), ...meta);
    }
  }
}

export const logger = new Logger();
