import { createRemoteJWKSet, jwtVerify } from 'jose'
import { auth0 } from './auth0'

const issuer = `https://${process.env.AUTH0_DOMAIN}/`
const audience = process.env.AUTH0_AUDIENCE
const jwks = createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`))

export const verifyAccess = async ({ permission }: { permission: string }) => {
    const token = await (await auth0).getAccessToken()
    const { payload } = await jwtVerify(token.token, jwks, {
        issuer,
        audience,
    })
    if (!payload?.permissions || !Array.isArray(payload.permissions)) {
        console.error('Token is missing permissions claim')
        return new Response(null, { status: 403 })
    }
    if (!payload.permissions.includes(permission)) {
        console.error('Token is missing required permissions:', payload?.permissions)
        return new Response(null, { status: 403 })
    }
}
