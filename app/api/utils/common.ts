import { type NextRequest, NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'
import { encrypt, decrypt } from '@/utils/tools'
import crypto from "crypto";

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
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

export const getSession = (request: NextRequest, sessionID: string) => {
  const cookies = request.cookies;
  const k = cookies.get(sessionID)
  const raw = k?.value || '';
  if (raw) {
    return decrypt(raw);
  }
  return {};
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
