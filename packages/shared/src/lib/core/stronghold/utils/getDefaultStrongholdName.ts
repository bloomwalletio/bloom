import { getTimestampForFilenames } from '@core/utils'

export function getDefaultStrongholdName(): string {
    const timestamp = getTimestampForFilenames()
    return `bloom-backup-${timestamp}.stronghold`
}
