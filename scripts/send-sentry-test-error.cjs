#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

function readEnvValue(filePath, key) {
  if (!existsSync(filePath)) {
    return undefined;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  const prefix = `${key}=`;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.startsWith(prefix)) {
      continue;
    }

    const rawValue = trimmed.slice(prefix.length).trim();
    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      return rawValue.slice(1, -1);
    }

    return rawValue;
  }

  return undefined;
}

function resolveDsn() {
  if (process.env.SENTRY_DSN) {
    return process.env.SENTRY_DSN;
  }

  if (process.env.VITE_SENTRY_DSN) {
    return process.env.VITE_SENTRY_DSN;
  }

  const envFiles = [".env", ".env.local", ".env.development", ".env.example"];

  for (const envFile of envFiles) {
    const viteDsn = readEnvValue(envFile, "VITE_SENTRY_DSN");
    if (viteDsn) {
      return viteDsn;
    }

    const sentryDsn = readEnvValue(envFile, "SENTRY_DSN");
    if (sentryDsn) {
      return sentryDsn;
    }
  }

  return undefined;
}

function parseMessageArg() {
  const args = process.argv.slice(2);

  const messageIndex = args.indexOf("--message");
  if (messageIndex >= 0 && args[messageIndex + 1]) {
    return args[messageIndex + 1];
  }

  const inlineArg = args.find((arg) => arg.startsWith("--message="));
  if (inlineArg) {
    return inlineArg.split("=").slice(1).join("=");
  }

  return undefined;
}

const dsn = resolveDsn();
if (!dsn) {
  console.error(
    "Missing Sentry DSN. Set SENTRY_DSN or VITE_SENTRY_DSN in your environment or .env file.",
  );
  process.exit(1);
}

const cliPath =
  process.platform === "win32"
    ? path.join(process.cwd(), "node_modules", ".bin", "sentry-cli.cmd")
    : path.join(process.cwd(), "node_modules", ".bin", "sentry-cli");

if (!existsSync(cliPath)) {
  console.error(
    "Could not find sentry-cli at node_modules/.bin/sentry-cli. Run npm install first.",
  );
  process.exit(1);
}

const defaultMessage = `Xenith scripted Sentry test error ${new Date().toISOString()}`;
const message = parseMessageArg() || defaultMessage;

const result = spawnSync(
  cliPath,
  ["send-event", "--no-environ", "-m", message, "-l", "error"],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SENTRY_DSN: dsn,
    },
    encoding: "utf8",
  },
);

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

const match = (result.stdout || "").match(/Event id:\s*([0-9a-fA-F-]+)/);
if (match && match[1]) {
  console.log(`Sentry test error sent successfully. Event id: ${match[1]}`);
}
