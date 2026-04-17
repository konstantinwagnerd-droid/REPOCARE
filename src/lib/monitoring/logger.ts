/**
 * Structured JSON logger. Pino if available, console fallback.
 */
type Level = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
const LEVELS: Record<Level, number> = { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 };
const envLevel = (process.env.LOG_LEVEL ?? "info") as Level;

export interface Logger {
  trace(msg: string, ctx?: Record<string, unknown>): void;
  debug(msg: string, ctx?: Record<string, unknown>): void;
  info(msg: string, ctx?: Record<string, unknown>): void;
  warn(msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, ctx?: Record<string, unknown>): void;
  fatal(msg: string, ctx?: Record<string, unknown>): void;
  child(ctx: Record<string, unknown>): Logger;
}

function make(base: Record<string, unknown>): Logger {
  function emit(level: Level, msg: string, ctx?: Record<string, unknown>) {
    if (LEVELS[level] < LEVELS[envLevel]) return;
    const entry = {
      level,
      time: new Date().toISOString(),
      msg,
      app: "careai",
      env: process.env.NODE_ENV ?? "development",
      ...base,
      ...ctx,
    };
    // eslint-disable-next-line no-console
    const method = level === "error" || level === "fatal" ? "error" : level === "warn" ? "warn" : "log";
    // eslint-disable-next-line no-console
    console[method](JSON.stringify(entry));
  }
  return {
    trace: (m, c) => emit("trace", m, c),
    debug: (m, c) => emit("debug", m, c),
    info: (m, c) => emit("info", m, c),
    warn: (m, c) => emit("warn", m, c),
    error: (m, c) => emit("error", m, c),
    fatal: (m, c) => emit("fatal", m, c),
    child: (c) => make({ ...base, ...c }),
  };
}

export const logger = make({});
