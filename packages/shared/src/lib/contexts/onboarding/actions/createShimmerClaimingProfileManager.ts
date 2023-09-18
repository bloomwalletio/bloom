import { get } from 'svelte/store'
import { IOTA_COIN_TYPE } from '@core/network/constants'
import { getSecretManagerFromProfileType, initialiseProfileManager } from '@core/profile-manager'
import { generateRandomId } from '@core/utils'
import { RestoreProfileType } from '../enums'
import { getTemporaryProfileManagerStorageDirectory } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager } from '../stores'

export async function createShimmerClaimingProfileManager(): Promise<void> {
    const $onboardingProfile = get(onboardingProfile)
    if (!$onboardingProfile) {
        return
    }

    const storagePath = await getTemporaryProfileManagerStorageDirectory()
    const coinType = IOTA_COIN_TYPE
    const clientOptions = $onboardingProfile?.clientOptions
    const secretManager = getSecretManagerFromProfileType($onboardingProfile?.type, storagePath)

    const manager = await initialiseProfileManager(
        storagePath,
        coinType,
        clientOptions,
        secretManager,
        generateRandomId()
    )

    if ($onboardingProfile?.restoreProfileType !== RestoreProfileType.Ledger) {
        await manager.setStrongholdPassword($onboardingProfile?.strongholdPassword)
    }

    shimmerClaimingProfileManager.set(manager)
}
