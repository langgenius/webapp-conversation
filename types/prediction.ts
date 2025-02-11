export interface PredictionForm {
  gender: 'male' | 'female' | 'other'
  calendarType: 'solar' | 'lunar'
  birthDate: string    // ISO 格式的日期字符串
  birthTime: string    // HH:mm 格式
  direction: string[]
  customDirections?: string
}

export interface BaziInfo {
  solarDate: string    // 公历日期
  lunarDate: string    // 农历日期
  year: string         // 年柱
  month: string        // 月柱
  day: string          // 日柱
  hour: string         // 时柱
  currentBazi: string  // 当前时辰八字
}

export interface PredictionResult {
  content: string
  timestamp: number
} 