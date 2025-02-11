export interface PredictionLog {
  userId: string
  timestamp: number
  inputs: {
    gender: string
    birthDateTime: string
    directions: string[]
  }
  result: string
}

export const logPrediction = async (log: PredictionLog) => {
  try {
    console.log('Prediction Log:', {
      ...log,
      timestamp: Date.now()
    })
    // TODO: 后续可以添加数据存储逻辑
  } catch (error) {
    console.error('Failed to log prediction:', error)
  }
} 