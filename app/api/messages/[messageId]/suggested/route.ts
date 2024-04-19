import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function GET(request: NextRequest, { params }: {
  params: { messageId: string }
}) {
  const { messageId } = params
  const { user } = getInfo(request)
  const { data } = await client.sendRequest("GET", `/messages/${messageId}/suggested`, null, {user})
  return NextResponse.json(data)
}
