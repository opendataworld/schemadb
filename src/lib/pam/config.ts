// PAM (Privileged Access Management) Configuration
export const PAM_CONFIG = {
  // Enable PAM
  ENABLED: process.env.PAM_ENABLED === "true",
  
  // Vault provider: hashicorp | aws-secrets | azure-keyvault | none
  PROVIDER: process.env.PAM_PROVIDER || "none",
  
  // HashiCorp Vault
  VAULT_ADDR: process.env.VAULT_ADDR || "",
  VAULT_TOKEN: process.env.VAULT_TOKEN || "",
  VAULT_PATH: process.env.VAULT_PATH || "secret/data/schemaorg",
  
  // AWS Secrets Manager
  AWS_SECRETS_REGION: process.env.AWS_SECRETS_REGION || "us-east-1",
  AWS_SECRETS_PREFIX: process.env.AWS_SECRETS_PREFIX || "schemaorg/",
  
  // Azure Key Vault
  AZURE_VAULT_NAME: process.env.AZURE_VAULT_NAME || "",
  
  // Session recording
  SESSION_RECORDING: process.env.PAM_SESSION_RECORDING === "true",
  
  // MFA for privileged actions
  MFA_REQUIRED: process.env.PAM_MFA_REQUIRED === "true"
}
