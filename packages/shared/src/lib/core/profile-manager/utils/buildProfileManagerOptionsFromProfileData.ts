import { localize } from '@core/i18n'
import { DEFAULT_COIN_TYPE, getDefaultClientOptions } from '@core/network'
import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, type, network, clientOptions } = profileData
    if (!id || !network || !type) {
        return Promise.reject(localize('error.global.generic'))
    }

    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = network?.coinType ?? DEFAULT_COIN_TYPE[network?.id] ?? 1
    const profileClientOptions = clientOptions?.nodes?.length ? clientOptions : getDefaultClientOptions(network.id)
    const secretManager = getSecretManagerFromProfileType(type, storagePath)

    return {
        storagePath,
        coinType,
        clientOptions: profileClientOptions,
        secretManager,
    }
}
