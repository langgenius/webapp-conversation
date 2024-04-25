import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, ResponseWithSession, getSessionFromRequest } from '@/app/api/utils/common'
import { authSpeedyAgencyMember } from '@/app/api/utils/speedyagency'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { sessionId } = getInfo(request)

  try {
    const postData = await request.json();
    const mobile = postData?.mobile;
    if (mobile) {
      const channel = await authSpeedyAgencyMember(mobile);

      if (channel) {
        // console.log(`auth req: ${sessionId}`);

        return await ResponseWithSession(NextResponse.json({
          status: true,
        }), sessionId, {
          mobile,
          channel: `${channel}`,
        })
      }
    }
  }
  catch (error: any) {
    if (error instanceof Error) {
      return NextResponse.json({
        status: false,
        error: error.message,
      })
    }
  }

  return NextResponse.json({
    status: false,
    error: 'auth error',
  })
}

export async function GET(request: NextRequest) {
  const data = await getSessionFromRequest(request);
  const {sessionId} = getInfo(request);

  const hosts = request.headers.get('x-forwarded-host')?.split(',') || [];
  const ports = request.headers.get('x-forwarded-port')?.split(',') || [];
  const protos = request.headers.get('x-forwarded-proto')?.split(',') || [];

  const url = request.nextUrl.clone()
  url.host = hosts[0] || request.nextUrl.host
  url.port = ports[0] || request.nextUrl.port
  url.protocol = protos[0] || request.nextUrl.protocol
  url.pathname = '/';
  url.search = '';

  if (data) {
    // console.log(data);
    return ResponseWithSession(NextResponse.redirect(url), sessionId, data);
  }

  return NextResponse.redirect(url);
}
