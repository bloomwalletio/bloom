import { ThirdPartyAppName } from '../enums'
import { FIREFLY_SHIMMER_PROFILE_MIGRATION_MAP } from './firefly-shimmer'

export const THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP: Record<ThirdPartyAppName, Record<number, (existingProfile: unknown) => void>> = {
    [ThirdPartyAppName.Firefly]: FIREFLY_SHIMMER_PROFILE_MIGRATION_MAP,
    [ThirdPartyAppName.FireflyShimmer]: FIREFLY_SHIMMER_PROFILE_MIGRATION_MAP,
}
