import { getTimestamptForFilenames } from '@core/utils'

export function getDefaultStrongholdName(): string {
    const timestamp = getTimestamptForFilenames()
    return `bloom-backup-${timestamp}.stronghold`
}
