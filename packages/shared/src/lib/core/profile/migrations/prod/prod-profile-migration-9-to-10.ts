import { IPersistedProfile } from '@core/profile/interfaces'
import { prodProfileMigration2To3 } from './prod-profile-migration-2-to-3'
import { prodProfileMigration3To4 } from './prod-profile-migration-3-to-4'
import { prodProfileMigration5To6 } from './prod-profile-migration-5-to-6'
import { prodProfileMigration6To7 } from './prod-profile-migration-6-to-7'
import { prodProfileMigration7To8 } from './prod-profile-migration-7-to-8'
import { prodProfileMigration4To5 } from './prod-profile-migration-4-to-5'
import { prodProfileMigration8To9 } from './prod-profile-migration-8-to-9'

export async function prodProfileMigration9To10(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    // prodProfileMigration2To3 recovery
    // Sets the NFT id's to lower case
    await prodProfileMigration2To3(profile)

    // prodProfileMigration3To4
    // removes EVM Balance changes
    await prodProfileMigration3To4(profile)

    // prodProfileMigration4To5 recovery
    // fixes the features and migrates old local EVM transactions
    await prodProfileMigration4To5(profile)

    // prodProfileMigration5To6 recovery
    // Removes isDeveloperFeature and sets version track
    await prodProfileMigration5To6(profile)

    // prodProfileMigration6To7 recovery
    // Adds nft permissions and updates from old dapp name space object
    await prodProfileMigration6To7(profile)

    // prodProfileMigration7To8 recovery
    // Check nft has media url property
    await prodProfileMigration7To8(profile)

    // prodProfileMigration8To9 recovery
    await prodProfileMigration8To9(profile)

    return Promise.resolve()
}
