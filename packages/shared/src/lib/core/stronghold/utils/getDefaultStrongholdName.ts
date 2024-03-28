import { getTimestampForFilenames } from '@core/utils'

export function getDefaultStrongholdName(profileName: string | undefined): string {
    const timestamp = getTimestampForFilenames()
    return `bloom-backup-${profileName?.replaceAll(' ', '')}-${timestamp}.stronghold`
}
