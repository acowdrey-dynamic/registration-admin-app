'server-only'
import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { secretClient } from './keyVault'

export const auth0 = (async () => {
    const clientSecret = (await secretClient.getSecret('AUTH0-CLIENT-SECRET')).value
    const secret = (await secretClient.getSecret('AUTH0-SECRET')).value

    return new Auth0Client({
        noContentProfileResponseWhenUnauthenticated: true,
        secret,
        clientSecret,
    })
})()
