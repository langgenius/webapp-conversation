declare module 'lunar-typescript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar
    static fromDate(date: Date): Solar
    getLunar(): Lunar
  }

  export class Lunar {
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
    getYearInGanZhi(): string
    getMonthInGanZhi(): string
    getDayInGanZhi(): string
    getTimeInGanZhi(): string
    getEightChar(): EightChar
  }

  export class EightChar {
    getYear(): string
    getMonth(): string
    getDay(): string
    getTime(): string
    getYearGan(): string
    getMonthGan(): string
    getDayGan(): string
    getTimeGan(): string
    getYearZhi(): string
    getMonthZhi(): string
    getDayZhi(): string
    getTimeZhi(): string
    getYearWuXing(): string
    getMonthWuXing(): string
    getDayWuXing(): string
    getTimeWuXing(): string
    getYearNaYin(): string
    getMonthNaYin(): string
    getDayNaYin(): string
    getTimeNaYin(): string
    getYearShiShenGan(): string
    getMonthShiShenGan(): string
    getDayShiShenGan(): string
    getTimeShiShenGan(): string
    getYearShiShenZhi(): string
    getMonthShiShenZhi(): string
    getDayShiShenZhi(): string
    getTimeShiShenZhi(): string
    getYun(gender: number): Yun
  }

  export class Yun {
    getStartYear(): number
    getStartMonth(): number
    getStartDay(): number
    getDaYun(): DaYun[]
  }

  export class DaYun {
    getStartYear(): number
    getStartAge(): number
    getGanZhi(): string
    getLiuNian(): LiuNian[]
  }

  export class LiuNian {
    getYear(): number
    getAge(): number
    getGanZhi(): string
  }
} 