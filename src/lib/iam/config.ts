// IAM (Identity & Access Management) Configuration
export const IAM_CONFIG = {
  // Enable IAM
  ENABLED: process.env.IAM_ENABLED === "true",
  
  // Provider: authjs | nextauth | clerk | none
  PROVIDER: process.env.IAM_PROVIDER || "nextauth",
  
  // Auth.js / NextAuth
  AUTH_SECRET: process.env.AUTH_SECRET || "change-me",
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST === "true",
  
  // OAuth providers enabled
  GITHUB_ENABLED: process.env.GITHUB_ID ? true : false,
  GOOGLE_ENABLED: process.env.GOOGLE_CLIENT_ID ? true : false,
  LINKEDIN_ENABLED: process.env.LINKEDIN_CLIENT_ID ? true : false,
  FACEBOOK_ENABLED: process.env.FACEBOOK_CLIENT_ID ? true : false,
  
  // Role-based access
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean),
  MODERATOR_EMAILS: (process.env.MODERATOR_EMAILS || "").split(",").filter(Boolean)
}
