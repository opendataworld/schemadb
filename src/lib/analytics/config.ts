// Product Analytics - via environment variables
export const ANALYTICS_CONFIG = {
  ENABLED: process.env.ANALYTICS_ENABLED === "true",
  
  // Provider: posthog | amplitude | mixpanel | google | none
  PROVIDER: process.env.ANALYTICS_PROVIDER || "none",
  
  // PostHog
  POSTHOG_KEY: process.env.POSTHOG_KEY || "",
  POSTHOG_HOST: process.env.POSTHOG_HOST || "app.posthog.com",
  
  // Amplitude
  AMPLITUDE_KEY: process.env.AMPLITUDE_KEY || "",
  
  // Mixpanel
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN || "",
  
  // Google Analytics
  GA_ID: process.env.GA_ID || ""
}
