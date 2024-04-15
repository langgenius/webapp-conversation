import { type NextRequest, NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'
import { encrypt, decrypt } from '@/utils/tools'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const getSessionFromRequest = async (req: NextRequest): Promise<null|Record<string, string>> => {
  const hash = req.nextUrl.searchParams.get('hash');

  try {
    if (hash) {
      const data = await decrypt(hash);
      if (data?.channel) {
        return data;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const ResponseWithSession = async (resp:NextResponse, sessionId: string, value:Record<string, string> = {}) => {
  const data = await encrypt(value)
  resp.cookies.set('session_id', sessionId)
      .set(sessionId, data);

  return resp;
}

export async function getSession(request: NextRequest, sessionID: string): Promise<Record<string, string>|any> {
  const cookies = request.cookies;
  const k = cookies.get(sessionID)
  const raw = k?.value || '';
  if (raw) {
    try {
      return await decrypt(raw);
    } catch (error: any) {
      console.error(error);
    }
  }
  return null;
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
