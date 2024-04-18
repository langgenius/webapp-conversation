import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getInfo, setSession, getSession, generateUserHashFromMobile } from '@/app/api/utils/common'
import { ENABLE_AUTH } from '@/config'

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/font')) {
        return NextResponse.next();
    }
    if (request.nextUrl.pathname.endsWith('.ico')) {
        return NextResponse.next();
    }
    if (request.nextUrl.pathname.endsWith('.map')) {
        return NextResponse.next();
    }

    const { sessionId } = getInfo(request);

    if (request.nextUrl.pathname.startsWith('/auth')
        || request.nextUrl.pathname.startsWith('/api/auth')) {

        return NextResponse.next({
            headers: setSession(sessionId),
            request,
        });
    }

    // console.log(`middleware nextUrl: ${request.nextUrl.pathname}`);
    // console.log(`middleware auth: ${ENABLE_AUTH}`);
    if (ENABLE_AUTH) {
        const session = await getSession(request, sessionId);
        // console.log(`middleware: ${JSON.stringify(session)}`);
        if (session?.mobile) {
            request.headers.set("user_mobile", session?.mobile);
            request.headers.set("user_hash", session?.mobile);
        }
        // console.log(`middleware session: ${JSON.stringify(session)}`);

        if (session?.channel) {
            return NextResponse.next({
                headers: setSession(sessionId),
                request,
            });
        }

        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json({
                status: false,
                error: {
                    msg: "Auth Error",
                    code: 406,
                }
            }, {
                headers: setSession(sessionId),
                status: 406,
            });
        }

        const url = request.nextUrl.clone()
        url.pathname = '/auth';

        return NextResponse.redirect(url, {
            headers: setSession(sessionId),
        });
    }

    return NextResponse.next({
        headers: setSession(sessionId),
    });
}
