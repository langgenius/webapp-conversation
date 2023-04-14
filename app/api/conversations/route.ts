import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession, client } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request);
  const { data }: any = await client.getConversations(user);
  return NextResponse.json(data, {
    headers: setSession(sessionId)
  })
}