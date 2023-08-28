import { fetchAccessToken } from '@/service'
import { APP_ID } from '@/config'

export const checkOrSetAccessToken = async () => {
  const sharedToken = APP_ID
  const accessToken = localStorage.getItem('token') || JSON.stringify({ [sharedToken]: '' })
  let accessTokenJson = { [sharedToken]: '' }
  try {
    accessTokenJson = JSON.parse(accessToken)
  }
  catch (e) {

  }
  if (!accessTokenJson[sharedToken]) {
    const res = await fetchAccessToken(sharedToken)
    accessTokenJson[sharedToken] = res.access_token
    localStorage.setItem('token', JSON.stringify(accessTokenJson))
  }
}
