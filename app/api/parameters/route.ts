import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession, client } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request);
  const { data } = await client.getApplicationParameters(user);
  return NextResponse.json(data as object, {
    headers: setSession(sessionId)
  })
}