export interface UserCredits {
  available: number
  used: number
  history: {
    timestamp: number
    amount: number
    type: 'prediction' | 'ad_reward' | 'purchase'
    description: string
  }[]
} 