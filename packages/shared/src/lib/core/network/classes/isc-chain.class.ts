import { fetchIscAssetsForAccount } from '@core/layer-2/utils'
import { NetworkType } from '@core/network/enums'
import { getActiveProfileId } from '@core/profile/stores'
import { ITokenBalance } from '@core/token/interfaces'
import { IIscChain, IIscChainConfiguration, IIscChainMetadata } from '../interfaces'
import { EvmNetwork } from './evm-network.class'
import { IAccountState } from '@core/account/interfaces'
import { Nft } from '@core/nfts/interfaces'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { StardustActivityType } from '@core/activity'
import { getNftsFromNftIds } from '@core/nfts/utils'

export class IscChain extends EvmNetwork implements IIscChain {
    private readonly _chainApi: string
    private _metadata: IIscChainMetadata | undefined

    public readonly explorerUrl: string | undefined
    public readonly apiEndpoint: string
    public readonly aliasAddress: string
    public readonly type = NetworkType.Isc

    constructor(chainConfiguration: IIscChainConfiguration) {
        const { rpcEndpoint, aliasAddress, apiEndpoint } = chainConfiguration
        const _rpcEndpoint = new URL(`v1/chains/${aliasAddress}/evm`, rpcEndpoint).href

        super({ ...chainConfiguration, rpcEndpoint: _rpcEndpoint })

        this.aliasAddress = aliasAddress
        this.apiEndpoint = apiEndpoint
        this._chainApi = new URL(`v1/chains/${aliasAddress}`, apiEndpoint).href
    }

    getMetadata(): IIscChainMetadata | undefined {
        return this._metadata
    }

    async setMetadata(): Promise<void> {
        try {
            this._metadata = await this.fetchChainMetadata()
        } catch (err) {
            console.error(err)
        }
    }

    async getNftsForAccount(account: IAccountState): Promise<Nft[]> {
        // ERC721 NFTs
        const erc721Nfts = await super.getNftsForAccount(account)

        // Wrapped L1 IRC NFTs
        const transactionsOnChain = getPersistedTransactionsForChain(getActiveProfileId(), account.index, this)
        const nftIdsOnChain: string[] = []
        for (const transaction of transactionsOnChain) {
            if (!transaction.local) {
                continue
            }
            const transferInfo = getTransferInfoFromTransactionData(transaction.local, this)
            if (transferInfo?.type !== StardustActivityType.Nft || transferInfo.nftId.includes(':')) {
                continue
            }

            nftIdsOnChain.push(transferInfo.nftId)
        }
        const ircNfts = await getNftsFromNftIds(nftIdsOnChain, this.id)

        return [...ircNfts, ...erc721Nfts]
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEVM node URL (b/c it's actually just
     * the EVM JSON-RPC endpoint rather than the underlying WASP
     * node URL). See here for more: https://github.com/iotaledger/wasp/issues/2385
     */
    private async fetchChainMetadata(): Promise<IIscChainMetadata> {
        const response = await fetch(this._chainApi)
        return (await response.json()) as IIscChainMetadata
    }

    async getBalance(account: IAccountState): Promise<ITokenBalance | undefined> {
        const evmAddress = account.evmAddresses?.[this.coinType]
        if (!evmAddress) {
            return undefined
        }

        const tokenBalance = (await super.getBalance(account)) ?? {}
        const iscBalance = (await fetchIscAssetsForAccount(getActiveProfileId(), evmAddress, this, account)) ?? {}

        return { ...tokenBalance, ...iscBalance }
    }

    async getGasFeeEstimate(outputBytes: string): Promise<bigint> {
        const URL = `${this._chainApi}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes })

        const requestInit: RequestInit = {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(URL, requestInit)
        const data = await response.json()

        if (response.status === 200) {
            const gasFee = BigInt(data.gasFeeCharged)
            if (gasFee === BigInt(0)) {
                throw new Error(`Gas fee has an invalid value: ${gasFee}!`)
            }

            return gasFee
        } else {
            throw new Error(data)
        }
    }
}
