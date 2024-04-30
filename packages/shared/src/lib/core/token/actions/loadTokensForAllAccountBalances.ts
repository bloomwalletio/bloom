import { IEvmNetwork, IStardustNetwork, NetworkId, getEvmNetworks, getL1Network } from '@core/network'
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
    const l1StardustNetwork = getL1Network()
    const stardustTokens = await loadTokensForStardustNetwork(l1StardustNetwork, keepVerificationStatus)
    tokens[l1StardustNetwork.id] = stardustTokens

    for (const network of getEvmNetworks()) {
        const evmTokens = await loadTokensForEvmNetwork(network, keepVerificationStatus)
        tokens[network.id] = evmTokens
    }

    for (const [networkId, assets] of Object.entries(tokens)) {
        addPersistedToken(networkId as NetworkId, ...assets)
    }
}

async function loadTokensForStardustNetwork(
    network: IStardustNetwork,
    keepVerificationStatus: boolean
): Promise<IPersistedToken[]> {
    const storedVerificationStates: { [tokenId: string]: TokenVerification } = keepVerificationStatus
        ? getPersistedVerificationStatesForNetwork(network.id)
        : {}

    const baseCoin: IPersistedToken = {
        id: BASE_TOKEN_ID,
        standard: TokenStandard.BaseToken,
        metadata: network.baseToken,
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const tokens: IPersistedToken[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokenBalances = account?.balances?.nativeTokens ?? []
        for (const tokenBalance of tokenBalances) {
            try {
                const token = await getOrRequestTokenFromPersistedTokens(tokenBalance.tokenId, network.id, false)
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
    network: IEvmNetwork,
    keepVerificationStatus: boolean
): Promise<IPersistedToken[]> {
    const storedVerificationStates: { [tokenId: string]: TokenVerification } = keepVerificationStatus
        ? getPersistedVerificationStatesForNetwork(network.id)
        : {}

    const baseCoin: IPersistedToken = {
        id: BASE_TOKEN_ID,
        standard: TokenStandard.BaseToken,
        metadata: network.baseToken,
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const tokens: IPersistedToken[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokenBalances = getLayer2AccountBalance(account.index)?.[network.id] ?? {}
        for (const tokenId of Object.keys(tokenBalances)) {
            try {
                const token = await getOrRequestTokenFromPersistedTokens(tokenId, network.id, false)
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
