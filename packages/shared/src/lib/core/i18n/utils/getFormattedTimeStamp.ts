import { formatDate } from '@core/i18n'

export function getFormattedTimeStamp(date: Date): string | undefined {
    try {
        if (date) {
            return formatDate(date, {
                dateStyle: 'long',
                timeStyle: 'medium',
            })
        }
    } catch {
        // do nothing
    }
}
