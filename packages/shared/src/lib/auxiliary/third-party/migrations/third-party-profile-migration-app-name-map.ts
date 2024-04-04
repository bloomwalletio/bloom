import { ThirdPartyAppName } from '../enums'
import { FIREFLY_STARDUST_PROFILE_MIGRATION_MAP } from './firefly-stardust'

export const THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP: Record<
    ThirdPartyAppName,
    Record<number, (existingProfile: unknown) => void>
> = {
    [ThirdPartyAppName.Firefly]: FIREFLY_STARDUST_PROFILE_MIGRATION_MAP,
    [ThirdPartyAppName.FireflyShimmer]: FIREFLY_STARDUST_PROFILE_MIGRATION_MAP,
}
