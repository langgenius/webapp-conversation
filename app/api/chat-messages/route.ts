import { type NextRequest } from 'next/server'
import { getInfo, client } from '@/app/api/utils/common'
import { OpenAIStream } from '@/app/api/utils/stream'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    conversation_id: conversationId,
    response_mode: responseMode
  } = body
  const { user } = getInfo(request);
  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId)
  const stream = await OpenAIStream(res as any)
  return new Response(stream as any)
}