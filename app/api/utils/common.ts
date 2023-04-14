import { type NextRequest } from 'next/server'
import { APP_ID, API_KEY } from '@/config'
import { ChatClient } from '../sdk'
const userPrefix = `user_${APP_ID}:`;
const uuid = require('uuid')

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || uuid.v4();
  const user = userPrefix + sessionId;
  return {
    sessionId,
    user
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY)