// Simple analytics tracker mock
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
};

const events: AnalyticsEvent[] = [];

export function trackEvent(event: AnalyticsEvent) {
  events.push({ ...event, timestamp: new Date().toISOString() });
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info('[analytics]', event.name, event.properties || {});
  }
}

export function getEvents() {
  return [...events];
}
