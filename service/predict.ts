import { PredictionForm, LunarInfo } from '@/types/prediction'
import { APP_ID, API_KEY, API_URL } from '@/config'
import { logPrediction } from './logger'
import { Solar } from 'lunar-typescript'

interface BaziInfo {
  solarDate: string
  lunarDate: string
  year: string
  month: string
  day: string
  hour: string
}

export async function fetchPredict(data: PredictionForm) {
  // 计算八字信息
  const bazi = calculateBazi(data.birthDate, data.birthTime, data.calendarType === 'lunar')
  const lunarInfo = calculateLunarInfo(
    parseInt(data.birthDate.split('-')[0]),
    parseInt(data.birthDate.split('-')[1]),
    parseInt(data.birthDate.split('-')[2]),
    parseInt(data.birthTime.split(':')[0])
  )

  const response = await fetch(`${API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
      'Origin': window.location.origin
    },
    body: JSON.stringify({
      conversation_id: '',
      app_id: APP_ID,
      inputs: {},
      query: generatePrompt(data, bazi, lunarInfo),
      user: "anonymous",
      response_mode: "blocking",
      conversation_history: []
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API Error:', errorData)
    throw new Error(errorData.message || '预测请求失败')
  }

  const result = await response.json()

  // 记录预测日志
  await logPrediction({
    userId: 'anonymous',
    timestamp: Date.now(),
    inputs: {
      gender: data.gender,
      birthDateTime: `${data.birthDate} ${data.birthTime}`,
      directions: data.direction || []
    },
    result: result.answer
  })

  return {
    content: result.answer,
    timestamp: Date.now()
  }
}

function calculateBazi(date: string, time: string, isLunar: boolean): BaziInfo {
  const [year, month, day] = date.split('-').map(Number)
  const [hour] = time.split(':').map(Number)

  const solar = Solar.fromYmd(year, month, day)
  const lunar = solar.getLunar()
  const eightChar = lunar.getEightChar()

  return {
    solarDate: `${year}-${month}-${day}`,
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    year: `${eightChar.getYearGan()}${eightChar.getYearZhi()}`,
    month: `${eightChar.getMonthGan()}${eightChar.getMonthZhi()}`,
    day: `${eightChar.getDayGan()}${eightChar.getDayZhi()}`,
    hour: `${eightChar.getTimeGan()}${eightChar.getTimeZhi()}`
  }
}

function calculateLunarInfo(year?: number, month?: number, day?: number, hour?: number): LunarInfo | null {
  if (!year || !month || !day) return null

  try {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()
    const eightChar = lunar.getEightChar()

    // 计算五行属性
    const wuxing = {
      year: eightChar.getYearWuXing(),
      month: eightChar.getMonthWuXing(),
      day: eightChar.getDayWuXing(),
      time: hour !== undefined ? eightChar.getTimeWuXing() : ''
    }

    // 计算纳音
    const nayin = {
      year: eightChar.getYearNaYin(),
      month: eightChar.getMonthNaYin(),
      day: eightChar.getDayNaYin(),
      time: hour !== undefined ? eightChar.getTimeNaYin() : ''
    }

    // 计算十神
    const shishen = {
      yearGan: eightChar.getYearShiShenGan(),
      monthGan: eightChar.getMonthShiShenGan(),
      dayGan: eightChar.getDayShiShenGan(),
      timeGan: hour !== undefined ? eightChar.getTimeShiShenGan() : '',
      yearZhi: eightChar.getYearShiShenZhi(),
      monthZhi: eightChar.getMonthShiShenZhi(),
      dayZhi: eightChar.getDayShiShenZhi(),
      timeZhi: hour !== undefined ? eightChar.getTimeShiShenZhi() : ''
    }

    // 计算大运
    const yun = eightChar.getYun(1) // 默认阳男阴女
    const daYunArr = yun.getDaYun()

    // 获取大运信息
    const daYunInfo = daYunArr.slice(0, 8).map(daYun => ({
      startYear: daYun.getStartYear(),
      startAge: daYun.getStartAge(),
      ganZhi: daYun.getGanZhi(),
      liuNian: daYun.getLiuNian().slice(0, 10).map(liuNian => ({
        year: liuNian.getYear(),
        age: liuNian.getAge(),
        ganZhi: liuNian.getGanZhi()
      }))
    }))

    return {
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      bazi: `${eightChar.getYearGan()}${eightChar.getYearZhi()} ${eightChar.getMonthGan()}${eightChar.getMonthZhi()} ${eightChar.getDayGan()}${eightChar.getDayZhi()} ${hour !== undefined ? `${eightChar.getTimeGan()}${eightChar.getTimeZhi()}` : ''}`,
      wuxing,
      nayin,
      shishen,
      yun: {
        startInfo: `出生${yun.getStartYear()}年${yun.getStartMonth()}月${yun.getStartDay()}天后起运`,
        daYun: daYunInfo
      }
    }
  } catch (err) {
    console.error('Calculate lunar info error:', err)
    return null
  }
}

function generatePrompt(data: PredictionForm, bazi: BaziInfo, lunarInfo: LunarInfo | null): string {
  const directions = data.direction?.join('、') || ''
  const customDirs = data.customDirections ? `\n自定义方向：${data.customDirections}` : ''

  // 计算当前年柱
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentSolar = Solar.fromDate(today)
  const currentLunar = currentSolar.getLunar()
  const currentEightChar = currentLunar.getEightChar()

  // 如果当前日期在2025年立春之后，使用2025年的年柱
  const is2025AfterLiChun = currentYear >= 2025 &&
    new Date() >= new Date(2025, 1, 4) // 2025年立春日期：2月4日
  const yearGanZhi = is2025AfterLiChun ?
    '乙巳' :  // 2025年的年柱
    `${currentEightChar.getYearGan()}${currentEightChar.getYearZhi()}`

  const formatSection = (title: string, content: string) => `## ${title}\n${content}\n`

  const basicInfo = formatSection('基本信息', `
- 性别：${data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '其他'}
- 出生时间：${data.birthDate} ${data.birthTime}
- 农历：${bazi.lunarDate}
- 八字：${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}
- 五行：${lunarInfo?.wuxing.year} ${lunarInfo?.wuxing.month} ${lunarInfo?.wuxing.day} ${lunarInfo?.wuxing.time}
- 纳音：${lunarInfo?.nayin.year} ${lunarInfo?.nayin.month} ${lunarInfo?.nayin.day} ${lunarInfo?.nayin.time}
- 大运：${lunarInfo?.yun?.startInfo}
- 当前年柱：${yearGanZhi}年`)

  const predictionDirections = formatSection('预测方向', `
主要方向：${directions}${customDirs}`)

  return `# 命理分析预测

${basicInfo}
${predictionDirections}

请根据以上信息进行命理分析和预测。分析内容应包括：

1. 八字格局总论
2. 五行喜忌分析
3. 大运流年吉凶
4. ${directions.split('、').filter(Boolean).map(dir => `${dir}运势分析`).join('\n5. ')}
${customDirs ? `6. ${customDirs}运势分析` : ''}`
} 