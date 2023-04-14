import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { APP_INFO } from '@/config'

export async function GET(request: NextRequest) {
  const { sessionId } = getInfo(request);
  return NextResponse.json(APP_INFO, {
    headers: setSession(sessionId)
  })
}