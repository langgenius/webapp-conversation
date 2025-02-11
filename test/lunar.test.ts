import { Solar } from 'lunar-typescript'

describe('八字计算测试', () => {
    test('基本八字信息计算', () => {
        // 测试用例：1986年5月29日 12时
        const solar = Solar.fromYmd(1986, 5, 29)
        const lunar = solar.getLunar()
        const eightChar = lunar.getEightChar()

        console.log('八字信息：', {
            年柱: {
                干: eightChar.getYearGan(),
                支: eightChar.getYearZhi(),
                五行: eightChar.getYearWuXing(),
                纳音: eightChar.getYearNaYin(),
                十神: eightChar.getYearShiShenGan()
            },
            月柱: {
                干: eightChar.getMonthGan(),
                支: eightChar.getMonthZhi(),
                五行: eightChar.getMonthWuXing(),
                纳音: eightChar.getMonthNaYin(),
                十神: eightChar.getMonthShiShenGan()
            },
            日柱: {
                干: eightChar.getDayGan(),
                支: eightChar.getDayZhi(),
                五行: eightChar.getDayWuXing(),
                纳音: eightChar.getDayNaYin(),
                十神: eightChar.getDayShiShenGan()
            },
            时柱: {
                干: eightChar.getTimeGan(),
                支: eightChar.getTimeZhi(),
                五行: eightChar.getTimeWuXing(),
                纳音: eightChar.getTimeNaYin(),
                十神: eightChar.getTimeShiShenGan()
            }
        })

        // 验证农历日期
        expect(lunar.getYearInChinese()).toBe('一九八六')
        expect(lunar.getMonthInChinese()).toBe('四')
        expect(lunar.getDayInChinese()).toBe('廿一')

        // 验证八字干支
        expect(eightChar.getYearGan()).toBeTruthy()
        expect(eightChar.getYearZhi()).toBeTruthy()
        expect(eightChar.getMonthGan()).toBeTruthy()
        expect(eightChar.getMonthZhi()).toBeTruthy()
        expect(eightChar.getDayGan()).toBeTruthy()
        expect(eightChar.getDayZhi()).toBeTruthy()
        expect(eightChar.getTimeGan()).toBeTruthy()
        expect(eightChar.getTimeZhi()).toBeTruthy()

        // 验证五行
        expect(eightChar.getYearWuXing()).toBeTruthy()
        expect(eightChar.getMonthWuXing()).toBeTruthy()
        expect(eightChar.getDayWuXing()).toBeTruthy()
        expect(eightChar.getTimeWuXing()).toBeTruthy()

        // 验证纳音
        expect(eightChar.getYearNaYin()).toBeTruthy()
        expect(eightChar.getMonthNaYin()).toBeTruthy()
        expect(eightChar.getDayNaYin()).toBeTruthy()
        expect(eightChar.getTimeNaYin()).toBeTruthy()

        // 验证十神
        expect(eightChar.getYearShiShenGan()).toBeTruthy()
        expect(eightChar.getMonthShiShenGan()).toBeTruthy()
        expect(eightChar.getDayShiShenGan()).toBeTruthy()
        expect(eightChar.getTimeShiShenGan()).toBeTruthy()

        // 验证大运
        const yun = eightChar.getYun(1) // 测试阳男
        expect(yun.getStartYear()).toBeGreaterThan(0)
        expect(yun.getStartMonth()).toBeGreaterThan(0)
        expect(yun.getStartDay()).toBeGreaterThan(0)

        const daYun = yun.getDaYun()
        expect(daYun.length).toBeGreaterThan(0)

        // 输出大运信息
        console.log('大运信息：', {
            起运: {
                年: yun.getStartYear(),
                月: yun.getStartMonth(),
                日: yun.getStartDay()
            },
            大运: daYun.slice(0, 8).map(dy => ({
                起始年龄: dy.getStartAge(),
                干支: dy.getGanZhi(),
                流年: dy.getLiuNian().slice(0, 5).map(ln => ({
                    年份: ln.getYear(),
                    年龄: ln.getAge(),
                    干支: ln.getGanZhi()
                }))
            }))
        })
    })
}) 