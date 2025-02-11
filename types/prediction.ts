import { Lunar, EightChar, Yun, DaYun } from 'lunar-javascript'

export interface PredictionForm {
  gender: 'male' | 'female'
  calendarType: 'solar' | 'lunar'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthDate: string
  birthTime: string
  direction?: string[]
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

export interface LunarInfo {
  lunarDate: string
  bazi: string
  wuxing: {
    year: string
    month: string
    day: string
    time: string
  }
  nayin: {
    year: string
    month: string
    day: string
    time: string
  }
  shishen: {
    yearGan: string
    monthGan: string
    dayGan: string
    timeGan: string
    yearZhi: string
    monthZhi: string
    dayZhi: string
    timeZhi: string
  }
  yun?: {
    startInfo: string
    daYun: Array<{
      startYear: number
      startAge: number
      ganZhi: string
      liuNian?: Array<{
        year: number
        age: number
        ganZhi: string
      }>
    }>
  }
}

// 扩展 Window 接口以包含 lunar-javascript 的类型
declare global {
  interface Window {
    Lunar: typeof Lunar
    EightChar: typeof EightChar
    Yun: typeof Yun
    DaYun: typeof DaYun
  }
} 