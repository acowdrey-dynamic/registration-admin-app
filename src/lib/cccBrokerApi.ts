import axios from 'axios'
import { secretClient } from './keyVault'

const clientId = process.env.CCC_BROKER_CLIENT_ID

type BrokerToken = {
    token: string
    expiresAt: number // epoch seconds
}

let cachedBrokerToken: BrokerToken | null = null

export const getBrokerAccessToken = async () => {
    const clientSecret = (await secretClient.getSecret('CCC-BROKER-CLIENT-SECRET')).value
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const now = Math.floor(Date.now() / 1000)
    if (cachedBrokerToken && cachedBrokerToken.expiresAt > now + 10) {
        // 10 sec buffer
        return cachedBrokerToken.token
    }

    const response = await axios.post(
        `${process.env.CCC_BROKER_BASE_URL}/auth/token`,
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    )

    const { access_token, expires_in } = response.data

    cachedBrokerToken = {
        token: access_token,
        expiresAt: now + expires_in,
    }

    return access_token
}
