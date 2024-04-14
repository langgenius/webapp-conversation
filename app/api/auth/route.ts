import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { createSessionStore } from "@/utils/tools"
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

        const session = createSessionStore(sessionId)
        session.set({
          mobile,
          channel: `${channel}`,
        });

        session.get().then((data) => {
          console.log(`auth resp: ${JSON.stringify(data)}`);
        })

        return NextResponse.json({
          status: true,
        }, {
          headers: setSession(sessionId),
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
