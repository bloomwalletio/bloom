import { STRONGHOLD_VERSION } from '@core/stronghold/constants'
import { StrongholdVersion } from '@core/stronghold/enums'

export function isLatestStrongholdVersion(strongholdVersion: StrongholdVersion | undefined): boolean {
    return strongholdVersion === STRONGHOLD_VERSION
}
