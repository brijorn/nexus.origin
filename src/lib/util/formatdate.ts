export default function formatDate(value: string | number | Date, format?: string): string {
    if (typeof value == 'string') value = parseInt(value)

    const date = new Date(value)
    console.log(date.toLocaleString())

    const M = date.getUTCMonth()

    // January
    const MMMM = month[M]

    // Jan
    const MMM = MMMM.slice(0, 4)

    // Day of Month: 1
    const D = date.getUTCDate()
    console.log(D)

    // Day of Month: 1th
    const Do = D + ordinal(D)



    // Hour
    const h = date.getUTCHours()
    const hh = (h >= 12) ? h - 12 : h

    // am/pm
    const a = amPm(h)

    // AM/PM
    const A = a.toUpperCase()

    // Minutes: 0..5...50
    const m = date.getUTCMinutes()
    // Minutes: 00..05..50
    const mm = (m < 10) ? '0'+ m : m

    // 2019
    const YYYY = date.getUTCFullYear()
    // 19
    const YY = YYYY.toString().slice(2)

    const Z = date.getTimezoneOffset()

    const X = date.getUTCMilliseconds()
    const x = date

    const opt = {
        M: M,

        MMMM: MMMM,
        MMM: MMM,

        D: D,
        DO: Do,

        h: h,
        hh: hh,

        a: a,
        A: A,

        m: m,
        mm: mm,

        YYYY: YYYY,
        YY: YY
    }

    if (!format) return `${MMMM} ${Do} ${YYYY} ${hh}:${mm} ${a}`

    for (const [key, door] of Object.entries(opt)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (format.includes(key)) format = format?.replace(new RegExp(key, 'g'), door as any)
    }

    return format
}

const month: string[] = []
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

function ordinal (day: number) {
    const lastDigit = day.toString().split('').pop()

    if (day == 1) return 'st'
    if (day == 2) return 'nd'
    if (day == 3) return 'rd'
    else return 'th'

}

function amPm (day: number) {
    if (day >= 12) return 'pm'
    else return 'am'

}