// SSO (Single Sign-On) Configuration
export const SSO_CONFIG = {
  ENABLED: process.env.SSO_ENABLED === "true",
  PROVIDER: process.env.SSO_PROVIDER || "none",
  
  // SAML
  SAML_ENTRY_POINT: process.env.SAML_ENTRY_POINT || "",
  SAML_ISSUER: process.env.SAML_ISSUER || "schemaorg",
  SAML_CERT: process.env.SAML_CERT || "",
  
  // OIDC
  OIDC_ISSUER: process.env.OIDC_ISSUER || "",
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID || "",
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET || "",
  
  // Okta
  OKTA_DOMAIN: process.env.OKTA_DOMAIN || "",
  OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID || "",
  
  // Azure AD
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID || "",
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID || ""
}
