import { type NextRequest, NextResponse } from 'next/server'
import { NextRequest as Request } from 'next/server'
import GetConversationsHandler from '@/app/api/conversations/route'
import { v4 } from 'uuid'

function generateRequestWithCookies(request: NextRequest) {
    const sessionID = v4();
    request.cookies.set('session_id', sessionID);
    request.headers.set('user_hash', '11111111');
    return request;
}


describe("Test API Route", () => {
    it('GET /api/conversations', async function () {
        const req = generateRequestWithCookies(new Request(new URL('')));
        const resp = await GetConversationsHandler.GET(req);

        console.log(resp);

        expect(resp.statusCode).toEqual(200);
    });
});
