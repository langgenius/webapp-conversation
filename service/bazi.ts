import { Lunar } from 'lunar-javascript'
import solarLunar from 'solarlunar'

export interface BaziInfo {
  year: string  // 年柱
  month: string // 月柱
  day: string   // 日柱
  hour: string  // 时柱
  luck: string  // 运势
}

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): BaziInfo {
  // 获取农历日期
  const lunar = solarLunar.solar2lunar(year, month, day)
  
  // 使用 lunar-javascript 获取更详细的八字信息
  const lunarDate = Lunar.fromYmd(lunar.lYear, lunar.lMonth, lunar.lDay)
  const eightChar = lunarDate.getEightChar()
  
  // 获取时辰
  const hourBranch = getHourBranch(hour)
  
  return {
    year: `${eightChar.getYear()}`,
    month: `${eightChar.getMonth()}`,
    day: `${eightChar.getDay()}`,
    hour: hourBranch,
    luck: calculateLuck(eightChar, hourBranch)
  }
}

// 计算时辰地支
function getHourBranch(hour: number): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const index = Math.floor((hour + 1) / 2) % 12
  return branches[index]
}

// 简单的运势计算逻辑
function calculateLuck(eightChar: any, hourBranch: string): string {
  // 这里可以添加更复杂的运势计算逻辑
  return '根据八字推算...'
} 