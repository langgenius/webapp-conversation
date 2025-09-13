const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)] }
  return result
}
