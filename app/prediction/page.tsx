'use client'

import { useState, useEffect } from 'react'
import { Form, Radio, Select, Button, Card, message, Descriptions, Input, DatePicker, Checkbox, Alert, Modal } from 'antd'
import type { PredictionForm, PredictionResult, LunarInfo } from '@/types/prediction'
import { fetchPredict } from '@/service/predict'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Solar } from 'lunar-typescript'

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
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null)
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false)

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

  // 实时计算农历和八字信息
  const calculateLunarInfo = (year?: number, month?: number, day?: number, hour?: number): LunarInfo | null => {
    if (!year || !month || !day) return null

    try {
      const solar = Solar.fromYmd(year, month, day)
      const lunar = solar.getLunar()
      const eightChar = lunar.getEightChar()

      // 计算大运
      const yun = eightChar.getYun(form.getFieldValue('gender') === 'male' ? 1 : 0)
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
          year: eightChar.getYearWuXing(),
          month: eightChar.getMonthWuXing(),
          day: eightChar.getDayWuXing(),
          time: hour ? eightChar.getTimeWuXing() : ''
        },
        nayin: {
          year: eightChar.getYearNaYin(),
          month: eightChar.getMonthNaYin(),
          day: eightChar.getDayNaYin(),
          time: hour ? eightChar.getTimeNaYin() : ''
        },
        shishen: {
          yearGan: eightChar.getYearShiShenGan(),
          monthGan: eightChar.getMonthShiShenGan(),
          dayGan: eightChar.getDayShiShenGan(),
          timeGan: hour ? eightChar.getTimeShiShenGan() : '',
          yearZhi: eightChar.getYearShiShenZhi(),
          monthZhi: eightChar.getMonthShiShenZhi(),
          dayZhi: eightChar.getDayShiShenZhi(),
          timeZhi: hour ? eightChar.getTimeShiShenZhi() : ''
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

  const handleDateTimeChange = (type: 'year' | 'month' | 'day' | 'hour', value: number) => {
    const currentValues = form.getFieldsValue()
    const newValues = {
      ...currentValues,
      [`birth${type.charAt(0).toUpperCase() + type.slice(1)}`]: value
    }

    form.setFieldsValue(newValues)
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
      birthTime: `${String(values.birthHour).padStart(2, '0')}:00`,
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
      <h1 className="text-2xl font-bold text-center mb-4">命理分析</h1>

      <Modal
        title="免责声明"
        open={isDisclaimerVisible}
        onOk={() => setIsDisclaimerVisible(false)}
        onCancel={() => setIsDisclaimerVisible(false)}
        width={600}
      >
        <div className="text-sm">
          <p className="mb-2">本系统提供的命理分析和预测结果仅供参考，不构成任何形式的建议或指导：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>分析结果基于传统命理学理论，不具有科学依据</li>
            <li>系统不对任何个人决策负责，请谨慎参考预测结果</li>
            <li>重要人生决策请以科学理性的态度进行判断</li>
            <li>系统不收集、不存储任何个人隐私信息</li>
            <li>如有任何疑问，请及时与我们联系</li>
          </ul>
          <p className="mt-2 text-gray-500">继续使用表示您已阅读并同意以上声明</p>
        </div>
      </Modal>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          calendarType: 'solar',
          birthDate: dayjs(),
          birthHour: 12,
          agreement: false
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
              onChange={(value) => handleDateTimeChange('year', value)}
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
              onChange={(value) => handleDateTimeChange('month', value)}
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
            <Select
              placeholder="日"
              onChange={(value) => handleDateTimeChange('day', value)}
              className="w-full"
            >
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
            <Select
              placeholder="时辰"
              onChange={(value) => handleDateTimeChange('hour', value)}
              className="w-full"
            >
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
              <Descriptions.Item label="五行" span={2}>
                <div className="grid grid-cols-4 gap-2">
                  <div>年柱: {lunarInfo.wuxing.year}</div>
                  <div>月柱: {lunarInfo.wuxing.month}</div>
                  <div>日柱: {lunarInfo.wuxing.day}</div>
                  <div>时柱: {lunarInfo.wuxing.time}</div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="纳音" span={2}>
                <div className="grid grid-cols-4 gap-2">
                  <div>年柱: {lunarInfo.nayin.year}</div>
                  <div>月柱: {lunarInfo.nayin.month}</div>
                  <div>日柱: {lunarInfo.nayin.day}</div>
                  <div>时柱: {lunarInfo.nayin.time}</div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="十神" span={2}>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    <div>年干: {lunarInfo.shishen.yearGan}</div>
                    <div>月干: {lunarInfo.shishen.monthGan}</div>
                    <div>日干: {lunarInfo.shishen.dayGan}</div>
                    <div>时干: {lunarInfo.shishen.timeGan}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>年支: {lunarInfo.shishen.yearZhi}</div>
                    <div>月支: {lunarInfo.shishen.monthZhi}</div>
                    <div>日支: {lunarInfo.shishen.dayZhi}</div>
                    <div>时支: {lunarInfo.shishen.timeZhi}</div>
                  </div>
                </div>
              </Descriptions.Item>
              {lunarInfo.yun && (
                <>
                  <Descriptions.Item label="起运时间" span={2}>
                    {lunarInfo.yun.startInfo}
                  </Descriptions.Item>
                  <Descriptions.Item label="大运" span={2}>
                    <div className="grid grid-cols-2 gap-4">
                      {lunarInfo.yun.daYun.map((dayun, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium mb-2">
                            {dayun.startYear}年 ({dayun.startAge}岁) {dayun.ganZhi}运
                          </div>
                          <div className="text-xs space-y-1">
                            {dayun.liuNian?.slice(0, 5).map((liuNian, idx) => (
                              <div key={idx} className="text-gray-600">
                                {liuNian.year}年 ({liuNian.age}岁) - {liuNian.ganZhi}年
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Descriptions.Item>
                </>
              )}
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

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('请阅读并同意免责声明')),
            },
          ]}
        >
          <Checkbox>
            我已阅读并同意
            <Button type="link" className="p-0" onClick={() => setIsDisclaimerVisible(true)}>
              《免责声明》
            </Button>
          </Checkbox>
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
            预测时间: {dayjs(result.timestamp).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <article className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 mb-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic" {...props} />
                ),
                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="px-1 py-0.5 bg-gray-100 rounded text-sm" {...props} />
                  ) : (
                    <pre className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
                      <code className="text-sm" {...props} />
                    </pre>
                  )
                )
              }}
            >
              {result.content}
            </ReactMarkdown>
          </article>
        </Card>
      )}
    </div>
  )
} 