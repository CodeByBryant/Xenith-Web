import * as Sentry from "@sentry/react";
import React from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

const dsn =
  import.meta.env.VITE_SENTRY_DSN ||
  "https://272f861d486b5aadbbabe8a89d7869e2@o4511208650113024.ingest.us.sentry.io/4511208782364672";

const tracePropagationTargets: Array<string | RegExp> = [
  "localhost",
  /^https:\/\/.*\.supabase\.co/,
];

if (import.meta.env.VITE_APP_URL) {
  tracePropagationTargets.push(import.meta.env.VITE_APP_URL);
}

Sentry.init({
  dsn,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION || undefined,
  sendDefaultPii: true,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  tracePropagationTargets,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  debug: import.meta.env.DEV,
});
