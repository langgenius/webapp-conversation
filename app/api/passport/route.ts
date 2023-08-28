import { type NextRequest } from 'next/server'
import { client } from '@/app/api/utils/common'
import { API_KEY, API_URL, APP_ID } from '@/config'

// import { commonClient } from 'dify-client'
import axios from "axios";

export async function GET(request: NextRequest) {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    'X-App-Code': APP_ID
  };
  const res = await axios({
    url: 'https://api.dify.ai/v1/passport',
    headers,
    responseType: "json",
  })
  console.log(res)
  return new Response(res.data)
}
