import { PredictionForm } from '@/types/prediction'
import { APP_ID, API_KEY, API_URL } from '@/config'
import { logPrediction } from './logger'
import { Lunar, Solar } from 'lunar-javascript'

export async function fetchPredict(data: PredictionForm) {
  // 计算八字信息
  const bazi = calculateBazi(data.birthDate, data.birthTime, data.calendarType === 'lunar')

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
      query: generatePrompt(data, bazi),
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
      directions: data.direction
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
  const lunar = isLunar ? Lunar.fromYmd(year, month, day) : solar.getLunar()

  return {
    solarDate: solar.toYmd(),
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    year: lunar.getYearInGanZhi(),
    month: lunar.getMonthInGanZhi(),
    day: lunar.getDayInGanZhi(),
    hour: lunar.getTimeZhi()
  }
}

function generatePrompt(data: PredictionForm, bazi: BaziInfo): string {
  const directions = data.direction.join('、')
  const customDirs = data.customDirections ? `\n- 自定义方向：${data.customDirections}` : ''

  return `请根据以下信息进行未来预测：

## 基本信息
- 性别：${data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '其他'}
- 公历：${bazi.solarDate}
- 农历：${bazi.lunarDate}
- 八字：${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}
- 当前时间：${bazi.currentBazi}
- 预测方向：${directions}${customDirs}`
} 