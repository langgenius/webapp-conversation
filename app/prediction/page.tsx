'use client'

import { useState, useEffect } from 'react'
import { Form, Radio, Select, Button, Card, message, Descriptions, Input, DatePicker, Checkbox } from 'antd'
import type { PredictionForm, PredictionResult } from '@/types/prediction'
import { fetchPredict } from '@/service/predict'
import ReactMarkdown from 'react-markdown'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Solar } from 'lunar-javascript'

dayjs.locale('zh-cn')

const { TextArea } = Input
const { RangePicker } = DatePicker
const { Option } = Select

const directions = [
  { label: '事业发展', value: 'career', icon: '💼' },
  { label: '感情状况', value: 'relationship', icon: '❤️' },
  { label: '财运预测', value: 'wealth', icon: '💰' },
  { label: '健康状况', value: 'health', icon: '🏥' }
]

// 定义时辰
const timeSlots = [
  { start: 23, end: 1, name: '子时' },
  { start: 1, end: 3, name: '丑时' },
  { start: 3, end: 5, name: '寅时' },
  { start: 5, end: 7, name: '卯时' },
  { start: 7, end: 9, name: '辰时' },
  { start: 9, end: 11, name: '巳时' },
  { start: 11, end: 13, name: '午时' },
  { start: 13, end: 15, name: '未时' },
  { start: 15, end: 17, name: '申时' },
  { start: 17, end: 19, name: '酉时' },
  { start: 19, end: 21, name: '戌时' },
  { start: 21, end: 23, name: '亥时' }
]

export default function PredictionPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string>('')
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [lunarInfo, setLunarInfo] = useState<{
    lunarDate: string
    bazi: string
  } | null>(null)

  // 生成年份选项：1900年至今年，倒序排列
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  )

  // 生成月份选项：1-12月
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // 生成日期选项：1-31日
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  // 生成小时选项：0-23时
  const hourOptions = Array.from({ length: 24 }, (_, i) => i)

  // 生成分钟选项：0-59分，每15分钟一个选项
  const minuteOptions = Array.from({ length: 4 }, (_, i) => i * 15)

  // 根据年月计算当月天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  // 当年份或月份改变时，更新日期选项
  const currentDayOptions = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
  )

  // 获取时辰名称
  const getTimeSlotName = (hour: number) => {
    const slot = timeSlots.find(slot => {
      if (slot.start > slot.end) { // 跨夜的子时
        return hour >= slot.start || hour < slot.end
      }
      return hour >= slot.start && hour < slot.end
    })
    return slot?.name || '子时'
  }

  // 实时计算农历和八字
  const calculateLunarInfo = (year?: number, month?: number, day?: number, hour?: number) => {
    if (!year || !month || !day) return null

    try {
      const solar = Solar.fromYmd(year, month, day)
      const lunar = solar.getLunar()

      return {
        lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
        bazi: `${lunar.getYearInGanZhi()} ${lunar.getMonthInGanZhi()} ${lunar.getDayInGanZhi()} ${hour ? lunar.getTimeZhi() : ''}`
      }
    } catch (err) {
      console.error('Calculate lunar info error:', err)
      return null
    }
  }

  // 监听日期变化
  useEffect(() => {
    const values = form.getFieldsValue()
    if (values.birthYear && values.birthMonth && values.birthDay) {
      const info = calculateLunarInfo(
        values.birthYear,
        values.birthMonth,
        values.birthDay,
        values.birthHour
      )
      setLunarInfo(info)
    }
  }, [form.getFieldValue('birthYear'), form.getFieldValue('birthMonth'),
  form.getFieldValue('birthDay'), form.getFieldValue('birthHour')])

  const handleDateChange = (type: 'year' | 'month' | 'day' | 'hour', value: number) => {
    if (type === 'year') setSelectedYear(value)
    if (type === 'month') setSelectedMonth(value)

    // 更新表单值后计算农历信息
    const currentValues = form.getFieldsValue()
    const newValues = {
      ...currentValues,
      [type === 'year' ? 'birthYear' : type === 'month' ? 'birthMonth' :
        type === 'day' ? 'birthDay' : 'birthHour']: value
    }

    if (newValues.birthYear && newValues.birthMonth && newValues.birthDay) {
      const info = calculateLunarInfo(
        newValues.birthYear,
        newValues.birthMonth,
        newValues.birthDay,
        newValues.birthHour
      )
      setLunarInfo(info)
    }
  }

  const onFinish = async (values: any) => {
    const formData: PredictionForm = {
      ...values,
      birthDate: `${values.birthYear}-${String(values.birthMonth).padStart(2, '0')}-${String(values.birthDay).padStart(2, '0')}`,
      birthTime: `${String(values.birthHour).padStart(2, '0')}:${String(values.birthMinute).padStart(2, '0')}`,
    }

    setError('')
    setLoading(true)
    try {
      const response = await fetchPredict(formData)
      setResult(response)
      message.success('预测完成')
    } catch (err) {
      console.error('Prediction Error:', err)
      setError(err instanceof Error ? err.message : '预测失败，请稍后重试')
      message.error('预测失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">未来变量观测</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          calendarType: 'solar',
          birthDate: dayjs(),
          birthTime: dayjs('12:00', 'HH:mm'),
        }}
      >
        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group buttonStyle="solid" className="w-full">
            <Radio.Button value="male" className="w-1/3 text-center">👨 男</Radio.Button>
            <Radio.Button value="female" className="w-1/3 text-center">👩 女</Radio.Button>
            <Radio.Button value="other" className="w-1/3 text-center">⭐ 其他</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="历法选择"
          name="calendarType"
        >
          <Radio.Group
            onChange={(e) => setCalendarType(e.target.value)}
            buttonStyle="solid"
            className="w-full"
          >
            <Radio.Button value="solar" className="w-1/2 text-center">📅 公历</Radio.Button>
            <Radio.Button value="lunar" className="w-1/2 text-center">🏮 农历</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Form.Item
            label="出生年份"
            name="birthYear"
            rules={[{ required: true, message: '请选择出生年份' }]}
          >
            <Select
              placeholder="年"
              onChange={(value) => handleDateChange('year', value)}
              className="w-full"
            >
              {yearOptions.map(year => (
                <Option key={year} value={year}>{year}年</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="月份"
            name="birthMonth"
            rules={[{ required: true, message: '请选择月份' }]}
          >
            <Select
              placeholder="月"
              onChange={(value) => handleDateChange('month', value)}
              className="w-full"
            >
              {monthOptions.map(month => (
                <Option key={month} value={month}>{month}月</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="日期"
            name="birthDay"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <Select placeholder="日" className="w-full">
              {currentDayOptions.map(day => (
                <Option key={day} value={day}>{day}日</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="时辰"
            name="birthHour"
            rules={[{ required: true, message: '请选择时辰' }]}
          >
            <Select placeholder="时辰" className="w-full">
              {timeSlots.map((slot, index) => (
                <Option
                  key={index}
                  value={slot.start}
                >
                  {slot.name} ({String(slot.start).padStart(2, '0')}:00-{String(slot.end).padStart(2, '0')}:00)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="分钟"
            name="birthMinute"
            rules={[{ required: true, message: '请选择分钟' }]}
          >
            <Select placeholder="分" className="w-full">
              {minuteOptions.map(minute => (
                <Option key={minute} value={minute}>{minute}分</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {lunarInfo && (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <Descriptions
              bordered
              size="small"
              column={{ xs: 1, sm: 2 }}
              className="bg-white rounded-lg"
            >
              <Descriptions.Item label="农历日期" span={2}>
                {lunarInfo.lunarDate}
              </Descriptions.Item>
              <Descriptions.Item label="八字" span={2}>
                {lunarInfo.bazi}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        <Form.Item
          label="预测方向"
          required
          className="mb-8"
        >
          <div className="space-y-4">
            <Form.Item
              name="direction"
              rules={[{ required: true, message: '请至少选择一个预测方向' }]}
            >
              <Checkbox.Group className="grid grid-cols-2 gap-4">
                {directions.map(d => (
                  <Checkbox key={d.value} value={d.value} className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{d.icon}</span>
                      <span>{d.label}</span>
                    </span>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              name="customDirections"
            >
              <TextArea
                placeholder="其他感兴趣的预测方向（选填，每行一个）"
                autoSize={{ minRows: 2, maxRows: 6 }}
                className="rounded-lg"
              />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="h-12 text-lg"
          >
            {loading ? '正在推算命运轨迹...' : '开始预测'}
          </Button>
        </Form.Item>
      </Form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <Card className="mt-8 rounded-lg shadow-lg">
          <div className="text-sm text-gray-500 mb-2">
            预测时间: {new Date(result.timestamp).toLocaleString()}
          </div>
          <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:my-4 prose-p:my-2">
            <ReactMarkdown>{result.content}</ReactMarkdown>
          </article>
        </Card>
      )}
    </div>
  )
} 