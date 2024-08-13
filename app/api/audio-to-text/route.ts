import { type NextRequest } from 'next/server'
import { getInfo } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    formData.append('user', user)
    const response = await fetch(`${API_URL}/audio-to-text`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  catch (e: any) {
    return new Response(e.message)
  }
}
