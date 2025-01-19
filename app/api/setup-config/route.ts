import { NextResponse } from 'next/server'
import { API_KEY, API_URL, APP_ID } from '@/config'

export async function GET() {
  const res = {
    APP_ID,
    hasSetAppConfig: !!API_KEY && !!API_URL,
  }
  return NextResponse.json(res)
}
