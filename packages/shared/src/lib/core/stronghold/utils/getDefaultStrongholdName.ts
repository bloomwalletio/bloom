import { getTimestampForFilenames } from '@core/utils'

export function getDefaultStrongholdName(profileName: string | undefined): string {
    const _profileName = profileName ?? ''
    const timestamp = getTimestampForFilenames()
    return `bloom-backup-${_profileName.replaceAll(' ', '')}-${timestamp}.stronghold`
}
