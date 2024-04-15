import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, ResponseWithSession } from '@/app/api/utils/common'
import { authSpeedyAgencyMember } from '@/app/api/utils/speedyagency'

export async function POST(request: NextRequest) {
  const { sessionId } = getInfo(request)

  try {
    const postData = await request.json();
    const mobile = postData?.mobile;
    if (mobile) {
      const channel = await authSpeedyAgencyMember(mobile);

      if (channel) {
        console.log(`auth req: ${sessionId}`);

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
