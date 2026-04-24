import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const internalKey = request.headers.get('X-Internal-Key')
  if (internalKey !== 'hmd-summary-2024-secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversation_id, user_id } = await request.json()

  if (!conversation_id || !user_id) {
    return NextResponse.json({ error: 'Missing conversation_id or user_id' }, { status: 400 })
  }

  // Get conversation messages from Dify
  const difyKey = process.env.DIFY_API_KEY || 'app-8hui0wqTRSxKmCTKbjviGMbo'
  const difyRes = await fetch(
    `https://api.dify.ai/v1/messages?conversation_id=${conversation_id}&user=${encodeURIComponent(user_id)}&limit=50`,
    { headers: { Authorization: `Bearer ${difyKey}` } },
  )

  const difyData = await difyRes.json()
  const messages: any[] = difyData.data || []

  let conversation = ''
  for (const msg of messages) {
    if (msg.query) conversation += `العميل: ${msg.query}\n`
    if (msg.answer) conversation += `المساعد: ${msg.answer}\n`
    conversation += '---\n'
  }

  if (!conversation)
    return NextResponse.json({ summary: 'لا توجد رسائل متاحة في هذه المحادثة' })

  // Summarize with OpenAI
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'أنت مساعد CRM محترف. حلّل محادثة العميل مع chatbot واستخرج:\n1. هدف العميل الرئيسي\n2. تحدياته أو مشاكله\n3. مستوى اهتمامه\n4. توصية للمبيعات\nاكتب الملخص بالعربي بشكل مختصر وواضح.',
        },
        {
          role: 'user',
          content: `محادثة العميل:\n${conversation}\nاكتب ملخص CRM كامل.`,
        },
      ],
      max_tokens: 350,
      temperature: 0.4,
    }),
  })

  const openaiData = await openaiRes.json()
  const summary = openaiData.choices?.[0]?.message?.content || 'تعذر إنشاء الملخص'

  return NextResponse.json({ summary })
}
