import { localize } from '@core/i18n'

import { isValidDate } from './'
import {
    DAYS_PER_YEAR,
    HOURS_PER_DAY,
    MILLISECONDS_PER_SECOND,
    MINUTES_PER_HOUR,
    SECONDS_PER_DAY,
    SECONDS_PER_MINUTE,
} from './constants'
import { Duration } from './types'

/**
 * Returns true if a given expiration or timelock condition date/time is valid or
 * has not yet expired.
 */
export function isFutureDateTime(dateTime: Date): boolean {
    if (isValidDate(dateTime)) {
        const nowDateTime = Date.now()
        return dateTime.getTime() > nowDateTime
    } else {
        return false
    }
}

/**
 * Formats a duration in milliseconds into the best matching unit, i.e.
 * it will only return a number of days, hours, minutes, or seconds but NOT
 * together.
 *
 * @method getBestTimeDuration
 *
 * @param {number} millis
 * @param {Duration} noDurationUnit
 *
 * @returns {string}
 */
export const getBestTimeDuration = (millis: number, noDurationUnit: Duration = 'day', minimal = false): string => {
    const zeroTime = minimal ? '0' : localize(`times.${noDurationUnit || 'day'}`, { values: { time: 0 } })

    if (Number.isNaN(millis)) return zeroTime

    const inDays = millis / (HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inDays >= 1)
        return minimal
            ? `${Math.ceil(inDays)}d`
            : localize('times.day', { values: { time: inDays > 1 ? Math.ceil(inDays) : inDays } })

    const inHours = millis / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inHours >= 1)
        return minimal
            ? `${Math.ceil(inHours)}h`
            : localize('times.hour', { values: { time: inHours > 1 ? Math.ceil(inHours) : inHours } })

    const inMinutes = millis / (SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inMinutes >= 1)
        return minimal
            ? `${Math.ceil(inMinutes)}m`
            : localize('times.minute', { values: { time: inMinutes > 1 ? Math.ceil(inMinutes) : inMinutes } })

    const inSeconds = millis / MILLISECONDS_PER_SECOND
    if (inSeconds >= 1)
        return minimal
            ? `${Math.ceil(inSeconds)}s`
            : localize('times.second', { values: { time: inSeconds > 1 ? Math.ceil(inSeconds) : inSeconds } })

    return zeroTime
}

export function getTimeDifference(lateDate: Date, earlyDate: Date, showSeconds: boolean = false): string {
    const elapsedTime = lateDate.getTime() - earlyDate.getTime()
    const years = Math.floor(elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY * DAYS_PER_YEAR))
    const days = Math.floor(elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY)) % DAYS_PER_YEAR
    const hours = Math.floor(
        (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) % HOURS_PER_DAY
    )
    const minutes = Math.floor((elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) % MINUTES_PER_HOUR)
    const seconds = Math.floor((elapsedTime / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE)

    if (years > 0) {
        return `${years}y ${days}d`
    } else if (days > 9 || (days > 0 && hours === 0)) {
        return `${days}d`
    } else if (days > 0 && hours > 0) {
        return `${days}d ${hours}h`
    } else if (hours > 9 || (hours > 0 && minutes === 0)) {
        return `${hours}h`
    } else if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`
    } else if (minutes > 0) {
        return showSeconds ? `${minutes}min ${seconds}s` : `${minutes}min`
    } else if (seconds > 0) {
        return showSeconds ? `${seconds}s` : '<1min'
    } else {
        return ''
    }
}
