declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar
    static fromDate(date: Date): Solar
    getLunar(): Lunar
    toYmd(): string
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar
    static fromDate(date: Date): Lunar
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
    getYearInGanZhi(): string
    getMonthInGanZhi(): string
    getDayInGanZhi(): string
    getTimeZhi(): string
  }
} 