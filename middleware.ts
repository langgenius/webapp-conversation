import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSessionStore, userSession } from '@/utils/tools'
import { getInfo } from '@/app/api/utils/common'

export function middleware(request: NextRequest) {
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
        let resp = NextResponse.next();
        resp.cookies.set("session_id", sessionId);

        return resp;
    }

    console.log(`middleware: ${sessionId}`);

    const session = createSessionStore(sessionId)
    return session.get().then((data: userSession) => {
        console.log(`middleware: ${JSON.stringify(data)}`);

        if (data?.channel) {
            return NextResponse.next();
        }

        const url = request.nextUrl.clone()
        url.pathname = '/auth';

        let resp = NextResponse.rewrite(url);
        resp.cookies.set("session_id", sessionId);

        return resp;
    })
}
