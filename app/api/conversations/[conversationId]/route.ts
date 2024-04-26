import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest, { params }: {
    params: { conversationId: string }
}) {
    const { user } = getInfo(request);

    const { conversationId } = params
    const { data } = await client.deleteConversation(conversationId, user)
    return NextResponse.json(data)
}
