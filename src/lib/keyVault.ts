'server-only'

import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

const credential = new DefaultAzureCredential()

const vaultName = process.env.KEY_VAULT_NAME
const url = `https://${vaultName}.vault.azure.net`

export const secretClient = new SecretClient(url, credential)
