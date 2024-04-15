import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getInfo, setSession, getSession } from '@/app/api/utils/common'
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

    const { sessionId } = getInfo(request);

    if (request.nextUrl.pathname.startsWith('/auth')
        || request.nextUrl.pathname.startsWith('/api/auth')) {

        return NextResponse.next({
            headers: setSession(sessionId),
        });
    }

    // console.log(`middleware: ${sessionId}`);

    if (ENABLE_AUTH) {
        const session = await getSession(request, sessionId);
        // console.log(`middleware: ${JSON.stringify(session)}`);

        if (session?.channel) {
            return NextResponse.next({
                headers: setSession(sessionId),
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
