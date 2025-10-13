// src/lib/frontend-logger.ts
// Simple logger for the browser/client. Logs to the console with levels.

export const frontendLogger = {
  info: (...args: any[]) => {
    if (typeof window !== 'undefined') console.info('[INFO]', ...args)
  },
  warn: (...args: any[]) => {
    if (typeof window !== 'undefined') console.warn('[WARN]', ...args)
  },
  error: (...args: any[]) => {
    if (typeof window !== 'undefined') console.error('[ERROR]', ...args)
  },
  success: (...args: any[]) => {
    if (typeof window !== 'undefined') console.log('[SUCCESS]', ...args)
  },
  debug: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') console.debug('[DEBUG]', ...args)
  },
}
