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

  return {
    solarDate: `${year}-${month}-${day}`,
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    year: lunar.getYearInGanZhi(),
    month: lunar.getMonthInGanZhi(),
    day: lunar.getDayInGanZhi(),
    hour: lunar.getTimeZhi()
  }
}

function calculateLunarInfo(year?: number, month?: number, day?: number, hour?: number): LunarInfo | null {
  if (!year || !month || !day) return null

  try {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()
    const eightChar = lunar.getEightChar()

    // 计算大运
    const yun = eightChar.getYun(1) // 默认阳男阴女
    const daYunArr = yun.getDaYun()

    // 获取大运信息
    const daYunInfo = daYunArr.slice(0, 8).map(daYun => ({
      startYear: daYun.getStartYear(),
      startAge: daYun.getStartAge(),
      ganZhi: daYun.getGanZhi(),
      liuNian: daYun.getLiuNian().map(liuNian => ({
        year: liuNian.getYear(),
        age: liuNian.getAge(),
        ganZhi: liuNian.getGanZhi()
      }))
    }))

    return {
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      bazi: `${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${hour ? eightChar.getTime() : ''}`,
      wuxing: {
        year: eightChar.getYearWuXing() as string,
        month: eightChar.getMonthWuXing() as string,
        day: eightChar.getDayWuXing() as string,
        time: hour ? eightChar.getTimeWuXing() as string : ''
      },
      nayin: {
        year: eightChar.getYearNaYin() as string,
        month: eightChar.getMonthNaYin() as string,
        day: eightChar.getDayNaYin() as string,
        time: hour ? eightChar.getTimeNaYin() as string : ''
      },
      shishen: {
        yearGan: eightChar.getYearShiShenGan() as string,
        monthGan: eightChar.getMonthShiShenGan() as string,
        dayGan: eightChar.getDayShiShenGan() as string,
        timeGan: hour ? eightChar.getTimeShiShenGan() as string : '',
        yearZhi: eightChar.getYearShiShenZhi() as string,
        monthZhi: eightChar.getMonthShiShenZhi() as string,
        dayZhi: eightChar.getDayShiShenZhi() as string,
        timeZhi: hour ? eightChar.getTimeShiShenZhi() as string : ''
      },
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

  return `用户信息：
性别：${data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '其他'}
出生时间：${data.birthDate} ${data.birthTime}
农历日期：${bazi.lunarDate}
八字：${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}
五行：
  年柱：${lunarInfo?.wuxing?.year || ''}
  月柱：${lunarInfo?.wuxing?.month || ''}
  日柱：${lunarInfo?.wuxing?.day || ''}
  时柱：${lunarInfo?.wuxing?.time || ''}
纳音：
  年柱：${lunarInfo?.nayin?.year || ''}
  月柱：${lunarInfo?.nayin?.month || ''}
  日柱：${lunarInfo?.nayin?.day || ''}
  时柱：${lunarInfo?.nayin?.time || ''}
十神：
  年干：${lunarInfo?.shishen?.yearGan || ''}
  月干：${lunarInfo?.shishen?.monthGan || ''}
  日干：${lunarInfo?.shishen?.dayGan || ''}
  时干：${lunarInfo?.shishen?.timeGan || ''}
  年支：${lunarInfo?.shishen?.yearZhi || ''}
  月支：${lunarInfo?.shishen?.monthZhi || ''}
  日支：${lunarInfo?.shishen?.dayZhi || ''}
  时支：${lunarInfo?.shishen?.timeZhi || ''}
大运：${lunarInfo?.yun?.startInfo || ''}
预测方向：${directions}${customDirs}

请根据以上信息进行命理分析和预测。重点关注用户所选的预测方向，结合八字、五行、纳音和十神信息给出详细分析。分析内容应包括：
1. 八字格局分析
2. 五行喜忌
3. 大运流年分析
4. ${directions.split('、').filter(Boolean).map(dir => `关于${dir}的具体预测`).join('\n5. ')}
${customDirs ? `6. 关于${customDirs}的具体预测` : ''}`
} 