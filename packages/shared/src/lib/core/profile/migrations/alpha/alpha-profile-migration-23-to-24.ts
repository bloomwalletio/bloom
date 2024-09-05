import { SupportedStardustNetworkId, getDefaultClientOptions } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration23To24(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    // remove any nodes from client options of shimmer profiles that include the word tanglebay
    if (profile.network.id === SupportedStardustNetworkId.Shimmer && profile?.clientOptions?.nodes) {
        profile.clientOptions.nodes = profile.clientOptions.nodes.filter((node) => !node.url.includes('tanglebay'))

        // if the nodes are empty, set the nodes to the default shimmer nodes
        if (profile.clientOptions.nodes.length === 0) {
            profile.clientOptions = getDefaultClientOptions(SupportedStardustNetworkId.Shimmer)
        }
    }

    return Promise.resolve()
}
