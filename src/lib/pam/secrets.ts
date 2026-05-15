// PAM Secrets Manager
import { PAM_CONFIG } from "./config"

export async function getSecret(key: string): Promise<string | null> {
  if (PAM_CONFIG.PROVIDER === "none") return null
  
  switch (PAM_CONFIG.PROVIDER) {
    case "hashicorp":
      return getVaultSecret(key)
    case "aws-secrets":
      return getAWSecret(key)
    case "azure-keyvault":
      return getAzureSecret(key)
    default:
      return null
  }
}

async function getVaultSecret(key: string): Promise<string | null> {
  if (!PAM_CONFIG.VAULT_ADDR) return null
  try {
    const res = await fetch(`${PAM_CONFIG.VAULT_ADDR}/v1/${PAM_CONFIG.VAULT_PATH}/${key}`, {
      headers: { "X-Vault-Token": PAM_CONFIG.VAULT_TOKEN || "" }
    })
    const data = await res.json()
    return data.data?.data?.value || null
  } catch {
    return null
  }
}

async function getAWSecret(key: string): Promise<string | null> {
  // AWS Secrets Manager API
  return null
}

async function getAzureSecret(key: string): Promise<string | null> {
  // Azure Key Vault API
  return null
}

export { PAM_CONFIG }
