/**
 * Safe logger utility.
 *
 * Detailed errors are only printed in development. In production we keep the
 * console clean to avoid leaking database/RLS/internal details to attackers.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  error: (msg: string, err?: unknown) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(msg, err);
    }
  },
  warn: (msg: string, err?: unknown) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(msg, err);
    }
  },
  info: (msg: string, data?: unknown) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(msg, data);
    }
  },
};
