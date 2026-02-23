import { auth0 } from './src/lib/auth0'

export async function proxy(request: Request) {
    // Note that proxy uses the standard Request type
    return await (await auth0).middleware(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
