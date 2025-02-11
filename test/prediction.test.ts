import { Solar } from 'lunar-typescript'
import type { PredictionForm, LunarInfo, BaziInfo } from '@/types/prediction'

describe('命理预测功能测试', () => {
    const testCase = {
        birthDate: '1986-05-29',
        birthTime: '12:00',
        gender: 'male' as const,
        calendarType: 'solar' as const,
        direction: ['career', 'wealth'],
        customDirections: '学业发展'
    }

    test('基础信息计算', () => {
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        // 验证农历日期
        expect(lunar.getYearInChinese()).toBe('一九八六')
        expect(lunar.getMonthInChinese()).toBe('四')
        expect(lunar.getDayInChinese()).toBe('廿一')

        // 验证八字
        const baziInfo = {
            yearGan: eightChar.getYearGan(),
            yearZhi: eightChar.getYearZhi(),
            monthGan: eightChar.getMonthGan(),
            monthZhi: eightChar.getMonthZhi(),
            dayGan: eightChar.getDayGan(),
            dayZhi: eightChar.getDayZhi(),
            timeGan: eightChar.getTimeGan(),
            timeZhi: eightChar.getTimeZhi()
        }

        console.log('八字信息：', {
            年柱: `${baziInfo.yearGan}${baziInfo.yearZhi}`,
            月柱: `${baziInfo.monthGan}${baziInfo.monthZhi}`,
            日柱: `${baziInfo.dayGan}${baziInfo.dayZhi}`,
            时柱: `${baziInfo.timeGan}${baziInfo.timeZhi}`
        })

        expect(baziInfo.yearGan).toBeTruthy()
        expect(baziInfo.yearZhi).toBeTruthy()
    })

    test('五行计算', () => {
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        const wuxing = {
            year: eightChar.getYearWuXing(),
            month: eightChar.getMonthWuXing(),
            day: eightChar.getDayWuXing(),
            time: eightChar.getTimeWuXing()
        }

        console.log('五行信息：', wuxing)

        expect(wuxing.year).toBeTruthy()
        expect(wuxing.month).toBeTruthy()
        expect(wuxing.day).toBeTruthy()
        expect(wuxing.time).toBeTruthy()
    })

    test('纳音计算', () => {
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        const nayin = {
            year: eightChar.getYearNaYin(),
            month: eightChar.getMonthNaYin(),
            day: eightChar.getDayNaYin(),
            time: eightChar.getTimeNaYin()
        }

        console.log('纳音信息：', nayin)

        expect(nayin.year).toBeTruthy()
        expect(nayin.month).toBeTruthy()
        expect(nayin.day).toBeTruthy()
        expect(nayin.time).toBeTruthy()
    })

    test('大运计算', () => {
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        const yun = eightChar.getYun(1) // 测试阳男
        const daYunArr = yun.getDaYun()

        const yunInfo = {
            startYear: yun.getStartYear(),
            startMonth: yun.getStartMonth(),
            startDay: yun.getStartDay(),
            daYun: daYunArr.slice(0, 8).map(daYun => ({
                startYear: daYun.getStartYear(),
                startAge: daYun.getStartAge(),
                ganZhi: daYun.getGanZhi(),
                liuNian: daYun.getLiuNian().slice(0, 5).map(liuNian => ({
                    year: liuNian.getYear(),
                    age: liuNian.getAge(),
                    ganZhi: liuNian.getGanZhi()
                }))
            }))
        }

        console.log('大运信息：', {
            起运: {
                年: yunInfo.startYear,
                月: yunInfo.startMonth,
                日: yunInfo.startDay
            },
            大运: yunInfo.daYun.map(dy => ({
                起始年龄: dy.startAge,
                干支: dy.ganZhi,
                流年: dy.liuNian.map(ln => ({
                    年份: ln.year,
                    年龄: ln.age,
                    干支: ln.ganZhi
                }))
            }))
        })

        expect(yunInfo.startYear).toBeGreaterThan(0)
        expect(yunInfo.startMonth).toBeGreaterThan(0)
        expect(yunInfo.startDay).toBeGreaterThan(0)
        expect(yunInfo.daYun.length).toBeGreaterThan(0)
    })

    test('命理分析格式化', () => {
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        const formattedInfo = `
八字：${eightChar.getYearGan()}${eightChar.getYearZhi()} ${eightChar.getMonthGan()}${eightChar.getMonthZhi()} ${eightChar.getDayGan()}${eightChar.getDayZhi()} ${eightChar.getTimeGan()}${eightChar.getTimeZhi()}
五行：
  年柱：${eightChar.getYearWuXing()}
  月柱：${eightChar.getMonthWuXing()}
  日柱：${eightChar.getDayWuXing()}
  时柱：${eightChar.getTimeWuXing()}
纳音：
  年柱：${eightChar.getYearNaYin()}
  月柱：${eightChar.getMonthNaYin()}
  日柱：${eightChar.getDayNaYin()}
  时柱：${eightChar.getTimeNaYin()}`

        console.log('命理分析格式化结果：', formattedInfo)

        expect(formattedInfo).toContain('八字：')
        expect(formattedInfo).toContain('五行：')
        expect(formattedInfo).toContain('纳音：')
    })
}) 