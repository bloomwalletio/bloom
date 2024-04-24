import { EvmNetworkId, NetworkId, getActiveNetworkId, getEvmNetworks } from '@core/network'
import { getBaseToken } from '@core/profile/actions'
import { activeAccounts, activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { getOrRequestTokenFromPersistedTokens } from '.'
import { BASE_TOKEN_ID } from '../constants'
import { TokenStandard, VerifiedStatus } from '../enums'
import { IPersistedToken } from '../interfaces'
import {
    addPersistedToken,
    clearPersistedTokensForActiveProfile,
    persistedTokens,
} from '../stores/persisted-tokens.store'
import { TokenVerification } from '../types'
import { getLayer2AccountBalance } from '@core/layer-2/stores'

export async function loadTokensForAllAccountBalances(
    clearPersistedAssets = false,
    keepVerificationStatus = false
): Promise<void> {
    clearPersistedAssets && clearPersistedTokensForActiveProfile()

    const tokens: { [networkId: NetworkId]: IPersistedToken[] } = {}
    const stardustTokens = await loadTokensForStardustNetwork(keepVerificationStatus)
    tokens[getActiveNetworkId()] = stardustTokens

    for (const network of getEvmNetworks()) {
        const evmTokens = await loadTokensForEvmNetwork(network.id as EvmNetworkId, keepVerificationStatus)
        tokens[network.id] = evmTokens
    }

    for (const [networkId, assets] of Object.entries(tokens)) {
        addPersistedToken(networkId as NetworkId, ...assets)
    }
}

async function loadTokensForStardustNetwork(keepVerificationStatus: boolean): Promise<IPersistedToken[]> {
    const networkId = getActiveNetworkId()
    const storedVerificationStates: { [tokenId: string]: TokenVerification } = keepVerificationStatus
        ? getPersistedVerificationStatesForNetwork(networkId)
        : {}

    const baseCoin: IPersistedToken = {
        id: BASE_TOKEN_ID,
        standard: TokenStandard.BaseToken,
        metadata: getBaseToken(),
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const tokens: IPersistedToken[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokenBalances = account?.balances?.nativeTokens ?? []
        for (const tokenBalance of tokenBalances) {
            try {
                const token = await getOrRequestTokenFromPersistedTokens(tokenBalance.tokenId, networkId, false)
                if (token) {
                    tokens.push({
                        ...token,
                        verification: storedVerificationStates[token.id] ?? token.verification,
                    })
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    return [baseCoin, ...tokens]
}

async function loadTokensForEvmNetwork(
    networkId: EvmNetworkId,
    keepVerificationStatus: boolean
): Promise<IPersistedToken[]> {
    const storedVerificationStates: { [tokenId: string]: TokenVerification } = keepVerificationStatus
        ? getPersistedVerificationStatesForNetwork(networkId)
        : {}

    // TODO: Create a constant for each network class
    const baseCoin: IPersistedToken = {
        id: BASE_TOKEN_ID,
        standard: TokenStandard.BaseToken,
        metadata: getBaseToken(),
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const tokens: IPersistedToken[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokenBalances = getLayer2AccountBalance(account.index)?.[networkId] ?? {}
        for (const tokenId of Object.keys(tokenBalances)) {
            try {
                const token = await getOrRequestTokenFromPersistedTokens(tokenId, networkId, false)
                if (token) {
                    tokens.push({
                        ...token,
                        verification: storedVerificationStates[token.id] ?? token.verification,
                    })
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    return [baseCoin, ...tokens]
}

function getPersistedVerificationStatesForNetwork(networkId: NetworkId): { [tokenId: string]: TokenVerification } {
    const assets = get(persistedTokens)?.[get(activeProfile)?.id]?.[networkId] ?? {}
    const verificationStates: { [tokenId: string]: TokenVerification } = {}
    for (const [id, asset] of Object.entries(assets)) {
        verificationStates[id] = asset.verification
    }
    return verificationStates
}
